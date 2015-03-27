# Database

Uses MySQL

## Tables

### Devices

<pre>
+---------------+-----------------------+------+-----+---------+-------+
| Field         | Type                  | Null | Key | Default | Extra |
+---------------+-----------------------+------+-----+---------+-------+
| id            | varchar(255)          | NO   | PRI | NULL    |       |
| youTube       | tinyint(1)            | NO   |     | 1       |       |
| twitch        | tinyint(1)            | NO   |     | 1       |       |
| hitbox        | tinyint(1)            | NO   |     | 1       |       |
| type          | enum('','GCM','APNs') | NO   | PRI |         |       |
| announcements | tinyint(1)            | NO   |     | 1       |       |
+---------------+-----------------------+------+-----+---------+-------+
</pre>
