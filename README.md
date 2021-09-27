# Subgraph nft-bazaar-mumbai

### 在线查询地址：

https://thegraph.com/legacy-explorer/subgraph/iuscript/nft-bazaar-mumbai

### Subgraph endpoints:

Queries (HTTP):     https://api.thegraph.com/subgraphs/name/iuscript/nft-bazaar

### 请求示例

```json
{
  nfts {
    id
    tokenID
    tokenAddress
    tokenURI
  }
}
```

### 返回示例

```json
{
  "data": {
    "nfts": [
      {
        "id": "0x152883c98412293f43af53ac92be26b2b04f197a-0x1",
        "tokenAddress": "0x152883c98412293f43af53ac92be26b2b04f197a",
        "tokenID": "0x1",
        "tokenURI": "https://nftbazaar-test.oss-cn-beijing.aliyuncs.com/nft/1.json"
      },
      {
        "id": "0xdd2ac4a8bcae4faded6fa26141416a5c3b60fa2f-0x1",
        "tokenAddress": "0xdd2ac4a8bcae4faded6fa26141416a5c3b60fa2f",
        "tokenID": "0x1",
        "tokenURI": "https://nft.zerogoki.org/robot-nft/1"
      },
      {
        "id": "0xdd2ac4a8bcae4faded6fa26141416a5c3b60fa2f-0x10",
        "tokenAddress": "0xdd2ac4a8bcae4faded6fa26141416a5c3b60fa2f",
        "tokenID": "0x10",
        "tokenURI": "https://nft.zerogoki.org/robot-nft/16"
      },
      {
        "id": "0xdd2ac4a8bcae4faded6fa26141416a5c3b60fa2f-0x11",
        "tokenAddress": "0xdd2ac4a8bcae4faded6fa26141416a5c3b60fa2f",
        "tokenID": "0x11",
        "tokenURI": "https://nft.zerogoki.org/robot-nft/17"
      },
      {
        "id": "0xdd2ac4a8bcae4faded6fa26141416a5c3b60fa2f-0x12",
        "tokenAddress": "0xdd2ac4a8bcae4faded6fa26141416a5c3b60fa2f",
        "tokenID": "0x12",
        "tokenURI": "https://nft.zerogoki.org/robot-nft/18"
      }
    ]
  }
}
```

### 项目中使用的查询语句

不同情况下请求数据的语句将不相同，以下是各种情况获取数据的查询语句

#### 1、获取collectibles\On Sale

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

#### 2、获取created

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

#### 3、获取Biding

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

#### 4、获取nft详情

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

#### 5、获取nft在售列表
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

