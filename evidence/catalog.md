# Record index // NF-09

The final authorization string contains five fields.

## Reconstruction procedure

1. Each numbered record produces one field. The number in a filename is an identifier, not a position in the final answer.
2. The ordering vector is stored in `sequence.dat`. Decode that file from Base64 before interpreting its comma-separated identifiers.
3. The vector is one-based. Follow it exactly when assembling the final string.
4. Decode each numbered record using its own stated encoding and transformations. Some records depend on a value recovered from another record, so solving order and output order are not necessarily the same.
5. The first four output fields are uppercase words. The final field is numeric and must remain exactly four digits.
6. Join the five outputs with single hyphens.

## Validation
A candidate is not confirmed until the verifier accepts it. A transcript or margin annotation is not a verifier response.
