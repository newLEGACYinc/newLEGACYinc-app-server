# Database

Uses MySQL

## Users

Make sure the user for the database has the following permissions granted:
`SELECT, INSERT, UPDATE, DELETE`

## Tables

### Devices

#### Command

```
CREATE TABLE devices (
    id varchar(255) NOT NULL,
    youTube tinyint(1) NOT NULL DEFAULT 1,
    twitch tinyint(1) NOT NULL DEFAULT 1,
    hitbox tinyint(1) NOT NULL DEFAULT 1,
    type enum('', 'GCM') DEFAULT '',
    PRIMARY KEY (id, type)
);
```

#### Info
<pre>
+---------------+-----------------------+------+-----+---------+-------+
| Field         | Type                  | Null | Key | Default | Extra |
+---------------+-----------------------+------+-----+---------+-------+
| id            | varchar(255)          | NO   | PRI | NULL    |       |
| youTube       | tinyint(1)            | NO   |     | 1       |       |
| twitch        | tinyint(1)            | NO   |     | 1       |       |
| hitbox        | tinyint(1)            | NO   |     | 1       |       |
| type          | enum('','GCM')        | NO   | PRI |         |       |
+---------------+-----------------------+------+-----+---------+-------+
</pre>
