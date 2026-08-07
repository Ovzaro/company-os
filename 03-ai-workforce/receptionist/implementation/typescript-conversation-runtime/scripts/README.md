# Scripts

## Why this directory exists

`scripts/` holds repeatable automation for development, validation, builds, releases, migrations, and operations.

## What belongs here

Small, documented, deterministic scripts that support repository workflows belong here.

`receptionist.ts` is the local terminal channel. It owns terminal input/output
only and invokes the composed receptionist experience; it never calls a model
provider directly.

## What does not belong here

Application business logic, one-off personal commands, embedded credentials, and automation owned by a dedicated external system do not belong here.
