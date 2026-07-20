using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WhaleWatching.Api.Auth;
using WhaleWatching.Api.Domain;

namespace WhaleWatching.Api.Profiles;

[ApiController]
[Route("api/owner/profile")]
[Authorize(Policy = PortalPolicies.BoatOwner)]
public sealed class OwnerProfileController(UserManager<ApplicationUser> userManager) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<OwnerProfileDto>> GetProfile()
    {
        var user = await userManager.FindByIdAsync(UserId.ToString());
        return user is null ? NotFound() : Ok(ToDto(user));
    }

    [HttpPatch]
    public async Task<ActionResult<OwnerProfileDto>> UpdateProfile(UpdateOwnerProfileRequest request)
    {
        var user = await userManager.FindByIdAsync(UserId.ToString());
        if (user is null) return NotFound();

        var email = request.Email.Trim();
        if (!string.Equals(user.Email, email, StringComparison.OrdinalIgnoreCase))
        {
            var emailResult = await userManager.SetEmailAsync(user, email);
            if (!emailResult.Succeeded) return IdentityValidationProblem(emailResult);
            user.EmailConfirmed = true;
        }

        var phoneResult = await userManager.SetPhoneNumberAsync(user, request.PhoneNumber.Trim());
        if (!phoneResult.Succeeded) return IdentityValidationProblem(phoneResult);

        user.Bio = NullIfWhiteSpace(request.Bio);
        var updateResult = await userManager.UpdateAsync(user);
        if (!updateResult.Succeeded) return IdentityValidationProblem(updateResult);

        return Ok(ToDto(user));
    }

    [HttpGet("photo")]
    public async Task<IActionResult> GetPhoto()
    {
        var user = await userManager.FindByIdAsync(UserId.ToString());
        return user?.ProfilePhoto is { Length: > 0 }
            ? File(user.ProfilePhoto, user.ProfilePhotoContentType ?? "image/jpeg")
            : NotFound();
    }

    [HttpPost("photo")]
    [RequestSizeLimit(5 * 1024 * 1024)]
    public async Task<ActionResult<OwnerProfileDto>> UploadPhoto([FromForm] IFormFile photo)
    {
        if (photo.Length is 0 or > 5 * 1024 * 1024)
            return ValidationProblem("Profile picture must be between 1 byte and 5 MB.");
        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };
        if (!allowedTypes.Contains(photo.ContentType, StringComparer.OrdinalIgnoreCase))
            return ValidationProblem("Profile picture must be a JPEG, PNG, or WebP image.");

        var user = await userManager.FindByIdAsync(UserId.ToString());
        if (user is null) return NotFound();
        await using var stream = new MemoryStream();
        await photo.CopyToAsync(stream, HttpContext.RequestAborted);
        user.ProfilePhoto = stream.ToArray();
        user.ProfilePhotoContentType = photo.ContentType;
        var result = await userManager.UpdateAsync(user);
        return result.Succeeded ? Ok(ToDto(user)) : IdentityValidationProblem(result);
    }

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub")!);
    private static string? NullIfWhiteSpace(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    private static OwnerProfileDto ToDto(ApplicationUser user) => new(user.Id, user.UserName!,
        user.DisplayName, user.NicNumber!, user.Email!, user.PhoneNumber!, user.ProfilePhoto is { Length: > 0 }, user.Bio);

    private ActionResult IdentityValidationProblem(IdentityResult result)
    {
        foreach (var error in result.Errors) ModelState.AddModelError(error.Code, error.Description);
        return ValidationProblem(ModelState);
    }
}

public sealed record OwnerProfileDto(Guid Id, string UserName, string DisplayName, string NicNumber,
    string Email, string PhoneNumber, bool HasProfilePhoto, string? Bio);

public sealed class UpdateOwnerProfileRequest
{
    [Required, EmailAddress, MaxLength(256)]
    public required string Email { get; init; }

    [Required, Phone, MaxLength(32)]
    public required string PhoneNumber { get; init; }

    [MaxLength(1000)]
    public string? Bio { get; init; }
}
