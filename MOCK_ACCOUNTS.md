# Development mock accounts

These accounts are seeded from `DemoIdentitySeed` whenever the API runs in the Development environment. They are independent of the bootstrap accounts configured through `.env`, so Docker environment overrides do not replace them. Restart the API after pulling these changes so the accounts are inserted.

| Portal | Email | Password |
|---|---|---|
| Administrator | `admin@wwms.test` | `Admin#WWMS2026!Secure` |
| OPS | `ops@wwms.test` | `Ops#WWMS2026!Secure` |
| Shore Crew | `shore@wwms.test` | `Shore#WWMS2026!Secure` |
| Wildlife | `wildlife@wwms.test` | `Wildlife#WWMS2026!Secure` |
| Boat Owner | `owner@wwms.test` | `Owner#WWMS2026!Secure` |
| Boat Crew | `crew@wwms.test` | `Crew#WWMS2026!Secure` |
| Passenger | `passenger@wwms.test` | `Passenger#WWMS2026!Secure` |

The operational seed contains two owners (`owner@wwms.test` and `suresh.fernando@wwms.test`, both using the Boat Owner password), four boats, and ten assigned crew accounts. The primary crew account is `crew@wwms.test`; the other seeded crew emails are `amal.fernando`, `dinesh.kumara`, `lahiru.jayasinghe`, `pradeep.senanayake`, `kasun.perera`, `chamara.silva`, `isuru.madushan`, `tharindu.bandara`, and `ravindu.gamage`, all at `@wwms.test` and all using the Boat Crew password.

Every boat has scheduled and completed trips. These records and relationships are served from SQL Server to the owner, crew, admin, wildlife, shore, and OPS portals.
