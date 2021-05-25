# Subgraph nft-bazaar

### Subgraph endpoints:

Queries (HTTP):     https://api.thegraph.com/subgraphs/name/iuscript/nft-bazaar

Subscriptions (WS): wss://api.thegraph.com/subgraphs/name/iuscript/nft-bazaar

### 请求示例

```json
{
  users(first: 5) {
    id
    tokens {
      id
      tokenURI
    }
  }
  nfts(first: 5) {
    id
    tokenURI
    createdAtTimestamp
    createdAtBlockNumber
  }
}
```

### 返回示例

```json
{
  "data": {
    "nfts": [
      {
        "createdAtBlockNumber": "24969974",
        "createdAtTimestamp": "1621582792",
        "id": "0x1",
        "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210521_1621582778.json"
      },
      {
        "createdAtBlockNumber": "25025773",
        "createdAtTimestamp": "1621820740",
        "id": "0x2",
        "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621820401.json"
      },
      {
        "createdAtBlockNumber": "25025775",
        "createdAtTimestamp": "1621820748",
        "id": "0x3",
        "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621820730.json"
      },
      {
        "createdAtBlockNumber": "25025842",
        "createdAtTimestamp": "1621821032",
        "id": "0x4",
        "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621821021.json"
      },
      {
        "createdAtBlockNumber": "25026653",
        "createdAtTimestamp": "1621824492",
        "id": "0x5",
        "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621824482.json"
      }
    ],
    "users": [
      {
        "id": "0x05268002807f9c2b68259907f7b3a6b8b3102a3b",
        "tokens": [
          {
            "id": "0xd",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210525_1621926388.json"
          }
        ]
      },
      {
        "id": "0x8173c81647fc4f49fea287d5ff0e8d8a292121be",
        "tokens": [
          {
            "id": "0x4",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621821021.json"
          },
          {
            "id": "0x6",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621844883.json"
          },
          {
            "id": "0x9",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210525_1621912363.json"
          },
          {
            "id": "0xa",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210525_1621914899.json"
          },
          {
            "id": "0xb",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210525_1621923221.json"
          },
          {
            "id": "0xc",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210525_1621925629.json"
          }
        ]
      },
      {
        "id": "0xc839eb991094d611e08bc1c236f37551529ae534",
        "tokens": [
          {
            "id": "0x1",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210521_1621582778.json"
          },
          {
            "id": "0x2",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621820401.json"
          },
          {
            "id": "0x3",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621820730.json"
          },
          {
            "id": "0x5",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210524_1621824482.json"
          },
          {
            "id": "0x7",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210525_1621909726.json"
          },
          {
            "id": "0x8",
            "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/20210525_1621909763.json"
          }
        ]
      }
    ]
  }
}
```

