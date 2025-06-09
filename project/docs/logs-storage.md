```
    * As OopseLogsy I must support requests of the following type
        Give me all filtered logs between [begin, end]

    This implies the the logs are already filtered and we have easy access to requested range.

    How do we do?

    When parsing the logs we save this as follows:

    each field has a manager for 2 data files:
        - one for storing raw data
        - one for storing the offset and size of the data

    we store one file for active logs that can be requested.
        - this includes initially all the logs, when parsed
        - when filtering, logs should be stored here.
        note: this file contains only indices of active logs
```
