---
layout: post
title: High Availablity PostgreSQL Environment
published: false
categories:
---

You come up with a fantastic new idea (i.e. Uber for Dog Walking), start hacking away following the [12 factor app conventions](http://12factor.net/), and finally you're ready to deploy. 

In this post we are going to setup a high availablity (HA) PostgreSQL environment using [pgbouncer](https://wiki.postgresql.org/wiki/PgBouncer) for connection pooling and [repmgr](https://github.com/2ndQuadrant/repmgr) for managing the asyncronous replication.

Using your favourite cloud provider (I'm using [DigitalOcean](https://www.digitalocean.com/?refcode=b82a4bc13d5e)) create two new Ubuntu 14.04 LTS instances with private networking enabled called `db1` and `db2`. Take note of their respective IP addresses.

`db1` will be the master and `db2` the hot standby.

Follow the steps here: [Initial Server Setup with Ubuntu 14.04](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-ubuntu-14-04) to setup a new user and secure SSH.

### Configuration

The following steps should be performed on both servers. First up, install PostgresSQL 9.3 and repmgr:

{% highlight bash %}
$ sudo apt-get install postgresql-contrib postgresql-9.3 postgresql-9.3-repmgr repmgr
{% endhighlight %}

Set the `postgres` user's password (this will be removed later):

{% highlight bash %}
$ sudo passwd postgres
{% endhighlight %}

Switch to the postgres user:

{% highlight bash %}
$ sudo su - postgres
{% endhighlight %}

Now we must set up passwordless ssh between the two servers for the `postgres` user. First, generate a new ssh key (do not set a passphrase):

{% highlight bash %}
$ ssh-keygen
{% endhighlight %}

Now we must copy transfer the keys across to the other server.

{% highlight bash %}
$ ssh-copy-id $IP_ADDRESS_OF_ALTERNATE_SERVER
{% endhighlight %}

### Master Configuration

Now on to configuring `db1` - which will be the master in the cluster. First is the main configuration file: `/etc/postgresql/9.3/main/postgresql.conf`. Uncomment the following settings if they are commented, and modify the values according to what is listed below:

{% highlight bash %}
listen_addresses='*'
wal_level = 'hot_standby' 
archive_mode = on
archive_command = '/bin/false' 
max_wal_senders = 10
wal_keep_segments = 5000
hot_standby = on
{% endhighlight %}


`db2.mbgo.co` is now the new master, and it cache's will be cold meaning your application could expierence a short period of minor performance degredation.