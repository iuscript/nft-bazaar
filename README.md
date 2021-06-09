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

项目中使用的查询语句

###不同情况下请求数据的语句将不相同，以下是各种情况获取数据的查询语句
####1、获取collectibles\On Sale

```
query getCollectibles($owner:Bytes!){
  nfts(where:{owner:$owner}){
    id
    tokenURI
    owner
    holder
    offer{
      id
      isBid
      price
      paymentToken
      endTime
      transactionHash
    }
    order{
      price
      paymentToken
      transactionHash
    }
  }
}
```
获取内容后将根据offer的返回值进行处理，offer不为空的将同时加入On Sale的列表中

####2、获取created

```
query getCreated($creater:Bytes!){
  nfts(where:{creater:$creater}){
    id
    tokenURI
    owner
    holder
    offer{
      id
      isBid
      price
      paymentToken
      endTime
      transactionHash
    }
    orderHistory{
      id
      price
      paymentToken
      transactionHash
    }
  }
}
```

####3、获取Biding
```
query getBidding($bider:Bytes!){
  offers{
    id
    isBid
    seller
    price
    token{
      id
      tokenURI
      owner
      holder
    }
    bids(bider:$bider){
      id
      bider
    }
  }
}
```

判断bids的长度大于0则放入bidding的列表中

####4、获取nft详情

```
query getNftDetail($id:ID!){
  nft(id:$id){
    id
    tokenURI
    createdAtTimestamp
    transactionHash
    creater
    holder
    owner
    offer{
      id
      isBid
      seller
      price
      token
      paymentToken
      endTime
      createdAtTimestamp
      transactionHash
      contract
      bids{
        id
        bidder
        value
        createdAtTimestamp
        transactionHash
      }
    }
    orderHistory{
      id
      seller
      buyers
      token
      price
      paymentToken
      createdAtTimestamp
      transactionHash
    }
    bidHistory{
      id
      token
      offer
      bidder
      value
      createdAtTimestamp
      transactionHash
    }
  }
}
```

####5、获取nft在售列表
```
query getOffers{
  offers(orderBy:createdAtTimestamp,orderDirection:desc){
    id
    isBid
    seller
    price
    paymentToken
    endTime
    createdAtTimestamp
    transactionHash
    contract
    token{
      id
      tokenURI
    }
  }
}
```

