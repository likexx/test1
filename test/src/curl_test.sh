curl -XGET http://192.168.99.100/v1/journals/56d15d78ff76b2f469b219ca -H "Content-Type: application/json"


curl -XPUT http://192.168.99.100/v1/journals/56d15d78ff76b2f469b219ca -H "Content-Type: application/json" -d '{"title":"1232352352"}'


curl -XPOST http://192.168.99.100/v1/journals -H "Content-Type: application/json" -d '{"title":"BOOK 100"}'

curl -XDELETE http://192.168.99.100/v1/journals/56d16cb0f457930f004efd2d -H "Content-Type: application/json"

curl -XGET http://192.168.99.100/v1/journals/suggest/mon -H "Content-Type: application/json"
