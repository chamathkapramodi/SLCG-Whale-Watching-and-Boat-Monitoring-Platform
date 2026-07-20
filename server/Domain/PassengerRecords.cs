namespace WhaleWatching.Api.Domain;

public sealed class PassengerProfile
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string IdentificationNumber { get; set; } = string.Empty;
    public string NormalizedIdentificationNumber { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string NormalizedPhoneNumber { get; set; } = string.Empty;
    public string PassengerType { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string AgeCategory { get; set; } = string.Empty;
    public DateTimeOffset CreatedAtUtc { get; set; }
    public ICollection<TripPassenger> Trips { get; set; } = [];
    public ICollection<PassengerSession> Sessions { get; set; } = [];
}

public sealed class PassengerSession
{
    public Guid Id { get; set; }
    public Guid PassengerId { get; set; }
    public PassengerProfile Passenger { get; set; } = null!;
    public Guid TripId { get; set; }
    public Trip Trip { get; set; } = null!;
    public string TokenHash { get; set; } = string.Empty;
    public DateTimeOffset CreatedAtUtc { get; set; }
    public DateTimeOffset ExpiresAtUtc { get; set; }
}

public sealed class TripPassenger
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public Trip Trip { get; set; } = null!;
    public Guid PassengerId { get; set; }
    public PassengerProfile Passenger { get; set; } = null!;
    public DateTimeOffset RegisteredAtUtc { get; set; }
}
