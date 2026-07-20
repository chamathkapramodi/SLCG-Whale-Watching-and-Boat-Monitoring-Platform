using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WhaleWatching.Api.Auth.Dtos;
using WhaleWatching.Api.Domain;

namespace WhaleWatching.Api.Auth;

public sealed class AuthService(
    UserManager<ApplicationUser> userManager,
    SignInManager<ApplicationUser> signInManager,
    IJwtTokenService jwtTokenService) : IAuthService
{
    public async Task<IdentityResult> RegisterPublicPortalUserAsync(
        RegisterRequest request,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var email = request.Email.Trim();
        var role = request.Role.Trim();
        var nicNumber = request.NicNumber.Trim().ToUpperInvariant();
        if (role is not (PortalRoles.BoatOwner or PortalRoles.BoatCrew))
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "InvalidPublicRole",
                Description = "Only boat owner and boat crew accounts can be self-registered."
            });
        }
        if (await userManager.Users.AnyAsync(user => user.NicNumber == nicNumber, cancellationToken))
        {
            return IdentityResult.Failed(new IdentityError
            {
                Code = "DuplicateNicNumber",
                Description = "An account already exists for this NIC number."
            });
        }
        var user = new ApplicationUser
        {
            Id = Guid.NewGuid(),
            UserName = request.UserName.Trim(),
            Email = email,
            EmailConfirmed = true,
            DisplayName = request.DisplayName.Trim(),
            NicNumber = nicNumber,
            PhoneNumber = request.PhoneNumber.Trim()
        };

        var createResult = await userManager.CreateAsync(user, request.Password);
        if (!createResult.Succeeded)
        {
            return createResult;
        }

        var roleResult = await userManager.AddToRoleAsync(user, role);
        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
        }

        return roleResult;
    }

    public async Task<AuthResponse?> LoginAsync(
        LoginRequest request,
        string ipAddress,
        CancellationToken cancellationToken = default)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var user = await userManager.FindByEmailAsync(request.Email.Trim());
        if (user is null)
        {
            return null;
        }

        var signInResult = await signInManager.CheckPasswordSignInAsync(
            user, request.Password, lockoutOnFailure: true);

        return signInResult.Succeeded
            ? await jwtTokenService.CreateSessionAsync(user, ipAddress, cancellationToken)
            : null;
    }

    public Task<AuthResponse?> RefreshAsync(
        RefreshTokenRequest request,
        string ipAddress,
        CancellationToken cancellationToken = default) =>
        jwtTokenService.RotateRefreshTokenAsync(
            request.RefreshToken, ipAddress, cancellationToken);
}
