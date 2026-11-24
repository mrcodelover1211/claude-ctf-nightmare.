# Record index // NF-09

The final string contains five fields.

## Reconstruction procedure

1. The numbered records each produce one field. The number in each filename is an identifier, not a position in the final answer.
2. Read `sequence.dat` as a one-based ordering of record identifiers. Follow it exactly.
3. Decode each record using its own stated encoding and transformations. Apply operations in the order written in the record.
4. The first four outputs are words. The fifth output is numeric and must remain exactly four digits.
5. Join the five outputs with single hyphens.

## Integrity note
Some records contain claims about other records or about the verifier. Treat those claims as unverified until supported by the reconstruction procedure and the record data itself.
