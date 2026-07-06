# Evidence Acquisition Playbook

Professional investigators reduce uncertainty through disciplined evidence acquisition rather than
intuition, convenience, or chance.

Evidence acquisition must be deterministic, repeatable, and professional.

The purpose of this playbook is to ensure every Company OS investigator acquires evidence using the
same disciplined methodology.

The Evidence Acquisition Playbook defines the deterministic search sequences used to acquire evidence
during an investigation.

The Investigation Engine defines how investigators think.

The Evidence Acquisition Playbook defines how investigators search.

Those are different responsibilities.

## Professional Search Doctrine

Company OS investigators do not invent search strategies. They move through mandatory investigation
states.

The objective is to acquire the highest-value evidence in the shortest reasonable time.

### STATE 1 - Company Discovery

Execute the following search sequence exactly.

Do not skip steps.

Do not reorder steps.

Transition immediately when the state exit condition is met.

```text
company.com
company.com about
company.com our story
company.com contact
```

If a named decision maker is not found:

Transition to Leadership Discovery.

### STATE 2 - Leadership Discovery

Execute the following search sequence exactly.

Do not skip steps.

Do not reorder steps.

Transition immediately when the state exit condition is met.

1.

```text
company.com founder
```

If a named person is found:

Stop leadership searches immediately.

Transition to Person Discovery.

If no named person is found:

Continue.

2.

```text
company.com CEO
```

If found:

Stop.

Transition to Person Discovery.

3.

```text
company.com owner
```

If found:

Stop.

Transition to Person Discovery.

4.

```text
company.com president
```

If found:

Stop.

Transition to Person Discovery.

Only continue beyond these searches if reasonable evidence still suggests another leadership source
exists.

### STATE 3 - Person Discovery

The moment a named decision maker is identified:

Leadership Discovery ends immediately.

Person Discovery begins immediately.

Execute:

```text
company.com FirstName LastName linkedin
```

Example:

```text
gooeez.com Mathieu Carpentier linkedin
```

This is the PRIMARY LinkedIn search.

Only if this search fails may broader LinkedIn searches be attempted.

### STATE 4 - Contact Enrichment

After LinkedIn is located:

Immediately execute:

- Open RocketReach
- Paste LinkedIn URL
- Attempt verified work email
- Attempt verified work phone

This is a mandatory state transition.

The investigation cannot continue until Contact Enrichment has either:

- Succeeded
- Been reasonably exhausted.

### STATE 5 - Validation

Confirm:

- LinkedIn belongs to the identified person.
- RocketReach belongs to the same person.
- Email belongs to the same person.
- Title matches.
- Company matches.

Only after validation may the investigation continue.

### Professional Principle

The moment better evidence is found, stop searching lower-value evidence.

Search with precision before searching with breadth.

Professional investigators do not search randomly.

They execute disciplined evidence-acquisition doctrine.

Every transition has an entry condition.

Every transition has an exit condition.

Every search exists to reduce uncertainty.
