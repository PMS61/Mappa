# Test Get Room and Path Endpoint

To test the `get-room-and-path` endpoint, you can use the following cURL command:

```sh
curl -X POST "http://localhost:8000/room/get-room-and-path" \
     -H "Content-Type: application/json" \
     -d '{
           "repo_id": "test-repo-id"
         }'
```

Replace `http://localhost:8000` with the actual URL of your API if it's different, and replace `test-repo-id` with the appropriate value for your test.
```
