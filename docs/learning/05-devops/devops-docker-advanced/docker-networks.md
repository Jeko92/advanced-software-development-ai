# Docker Advanced - Docker Networks

So far every container has run alone. The scoreboard service printed to its logs, the Postgres container stored its data, and neither needed to know the other existed. That changes the moment the scoreboard has to read and write scores: it needs to open a connection to the database container. To do that, it needs an address to connect to, and finding that address is harder than it first looks.

Containers are isolated by default. Each one gets its own network namespace, which means it cannot simply reach another container by name e.g. localhost, and the IP address Docker assigns is not fixed. Restart a container and its IP can change, so hard-coding an address is fragile. What the scoreboard really wants is to say "connect to the database" by a stable name and have that name resolve to wherever the database currently is. That is what Docker networking provides.

A Docker network is a virtual network that containers can join. Containers on the same network can talk to each other; containers on different networks cannot, unless you connect them deliberately. This gives you two things at once. It gives you communication, so the scoreboard and the database can reach each other. And it gives you isolation, so you can keep unrelated groups of containers apart, the way you might separate a frontend's services from a backend's.

The piece that makes this pleasant to use is built-in DNS. When you put containers on a network you create yourself, Docker runs a small DNS service that resolves container names to their current IP addresses automatically. The scoreboard connects to the host `arcade-db`, and Docker translates that to whatever IP the database container has right now. You never deal with the IP directly, and the connection keeps working across restarts. The rest of this chapter starts from the networks Docker gives you by default, then builds the one the arcade services actually need.

## The default networks

Every Docker installation starts with three networks. List them with:

```bash
docker network ls
```

| Network | Driver | What it does                                    |
| ------- | ------ | ----------------------------------------------- |
| bridge  | bridge | The default for standalone containers           |
| host    | host   | Shares the host's network directly (Linux only) |
| none    | null   | No networking at all                            |

Unless you say otherwise, a container joins the default `bridge` network. There is a catch worth knowing: the default bridge does not give you DNS by container name. Containers on it can reach each other by IP address, but not by name. This is the main reason to create your own network rather than relying on the default one.

## User-defined networks and service discovery

Creating your own network is one command:

```bash
docker network create arcade-net
```

This makes a user-defined bridge network. The important difference from the default bridge is the DNS service: on a network you create, Docker resolves container names automatically. Run two containers on it and each can reach the other by name.

```bash
docker run -d --name arcade-db --network arcade-net \
  -e POSTGRES_PASSWORD=arcade-password \
  -e POSTGRES_USER=arcade-master \
  postgres

docker run -d --name scoreboard --network arcade-net \
  scoreboard-service:v2
```

- `--network arcade-net` attaches each container to the network as it starts.
- `--name` matters more than usual here, because the name is also the hostname other containers use. `arcade-db` is both the container's name and the address the scoreboard connects to.

Inside the scoreboard, the database connection points at the container name, not an IP address:

```ts
const databaseUrl =
  "postgresql://arcade-master:arcade-password@arcade-db:5432/postgres";
```

The url is composed out of the following parts: `postgresql://<user>:<password>@<host>:<port>/<database>`. Docker resolves the host `arcade-db` to the database container's current IP. If the database restarts and gets a new IP, the name still resolves correctly, so nothing in the scoreboard has to change.

Isolation is the other side of this. A container on `arcade-net` cannot reach a container that is not on `arcade-net`. If you put a second, unrelated group of containers on its own network, the two groups stay invisible to each other until you connect them on purpose.

## Connecting a container to more than one network

A container is not limited to a single network. You can attach one to a second network after it is already running:

```bash
docker network connect other-net scoreboard
```

After this, `scoreboard` belongs to both `arcade-net` and `other-net`, and can reach containers on either. This is how one service can act as a bridge between two otherwise isolated groups of containers.

## Inspecting and removing networks

To see which containers are attached to a network, along with its subnet and configuration, inspect it:

```bash
docker network inspect arcade-net
```

To see the network settings from a single container's point of view, inspect the container instead:

```bash
docker inspect scoreboard
```

When you no longer need a network, remove it:

```bash
docker network rm arcade-net
```

This only works once no containers are attached. Disconnect or remove the containers first, or the command fails.

## Resources

- [Networking overview - Docker Docs](https://docs.docker.com/network/)
- [Bridge networks - Docker Docs](https://docs.docker.com/network/drivers/bridge/)
- [Container networking - Docker Docs](https://docs.docker.com/config/containers/container-networking/)
