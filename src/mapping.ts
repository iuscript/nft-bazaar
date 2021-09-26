import { Address,BigInt, store } from '@graphprotocol/graph-ts'
import { Transfer, NFTBazaar_v2 as NFTBazaarContract } from '../generated/NFTBazaar_v2/NFTBazaar_v2'
import { Transfer as Transfer_MetaRobot, MetaRobot as MetaRobotContract } from '../generated/MetaRobot/MetaRobot'
import { Offered,Bought, NoLongerForSale, BidEntered, AuctionPass, ChangePrice } from '../generated/NFTMarket_v3/NFTMarket_v3'
import { User, Nft, Offer, Order, Market, DayData, Bid } from '../generated/schema'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const NFTBazaar_ADDRESS = '0x87c68F1e39cEEA6F32F7a7887E5Bbb27004EEC4f'
export const MetaRobot_ADDRESS = '0xdd2ac4A8bcae4FAdEd6fA26141416A5C3B60fa2f'
export const NFTMarket_ADDRESS = '0xa964762BAA19dDA30629E3c1935368a1C3251F21'

function _removeOffer(tokenKey: string): void {
  store.remove("Offer", tokenKey)
}

export function handleTransfer(event: Transfer): void {
  let from     = event.params.from
  let to       = event.params.to
  let tokenID  = event.params.tokenId
  let contract = NFTBazaarContract.bind(Address.fromString(NFTBazaar_ADDRESS))
  let nftID = NFTBazaar_ADDRESS.concat('-').concat(tokenID.toHexString())

  let user = User.load(to.toHexString())
  if (user === null) {
    user = new User(to.toHexString())
    user.save()
  }

  if (from.toHexString() == ADDRESS_ZERO) {
    let nft = new Nft(nftID)
    let tokenUri = contract.tokenURI(tokenID)
    nft.tokenID = tokenID.toHexString()
    nft.tokenAddress = Address.fromString(NFTBazaar_ADDRESS)
    nft.tokenURI = tokenUri
    nft.createdAtTimestamp = event.block.timestamp
    nft.createdAtBlockNumber = event.block.number
    nft.transactionHash = event.transaction.hash
    nft.creater = Address.fromString(ADDRESS_ZERO)
    nft.holder = user.id
    if (event.transaction.from.toHexString() != NFTMarket_ADDRESS) {
      nft.owner = to
    }
    nft.save()
  } else {
    let nft = Nft.load(nftID)
    nft.holder = to.toHexString()
    if (to.toHexString() != NFTMarket_ADDRESS) {
      nft.owner = to
    }
    nft.save()
  }
}

export function handleTransfer_MetaRobot(event: Transfer_MetaRobot): void {
  let from     = event.params.from
  let to       = event.params.to
  let tokenID  = event.params.tokenId
  let contract = MetaRobotContract.bind(Address.fromString(MetaRobot_ADDRESS))
  let nftID = MetaRobot_ADDRESS.concat('-').concat(tokenID.toHexString())

  let user = User.load(to.toHexString())
  if (user === null) {
    user = new User(to.toHexString())
    user.save()
  }

  if (from.toHexString() == ADDRESS_ZERO) {
    let nft = new Nft(nftID)
    let tokenUri = contract.tokenURI(tokenID)
    nft.tokenID = tokenID.toHexString()
    nft.tokenAddress = Address.fromString(MetaRobot_ADDRESS)
    nft.tokenURI = tokenUri
    nft.createdAtTimestamp = event.block.timestamp
    nft.createdAtBlockNumber = event.block.number
    nft.transactionHash = event.transaction.hash
    nft.creater = Address.fromString(ADDRESS_ZERO)
    nft.holder = user.id
    if (event.transaction.from.toHexString() != NFTMarket_ADDRESS) {
      nft.owner = to
    }
    nft.save()
  } else {
    let nft = Nft.load(nftID)
    nft.holder = to.toHexString()
    if (to.toHexString() != NFTMarket_ADDRESS) {
      nft.owner = to
    }
    nft.save()
  }
}

export function handleOffered_v3(event: Offered): void {
  let offerID = event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString())
  let nftID = event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString())

  let offer = new Offer(offerID)
  offer.tokenID = event.params.tokenID.toHexString()
  offer.tokenAddress = event.params.tokenAddress
  offer.isBid = event.params.isBid
  offer.seller = event.params.seller
  offer.price = event.params.price
  offer.token = offer.id
  offer.paymentToken = event.params.paymentToken
  offer.startTime = event.params.startTime
  offer.endTime = event.params.endTime
  offer.createdAtTimestamp = event.block.timestamp
  offer.createdAtBlockNumber = event.block.number
  offer.transactionHash = event.transaction.hash
  offer.contract = event.address
  offer.save()

  let nft = Nft.load(nftID)
  nft.owner = event.transaction.from
  if (nft.creater == Address.fromString(ADDRESS_ZERO)) {
    nft.creater = event.transaction.from
    nft.save()
  }

  let market = Market.load(NFTMarket_ADDRESS)
  if (market === null) {
    market = new Market(NFTMarket_ADDRESS)
    market.txCount = BigInt.fromI32(0)
    market.offersCount = BigInt.fromI32(1)
    market.volumeETH = BigInt.fromI32(0)
    market.volumeUSD = BigInt.fromI32(0)
  } else {
    market.offersCount = market.offersCount.plus(BigInt.fromI32(1))
  }
  market.save()
}

export function handleBought(event: Bought): void {
  let order = new Order(event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString()).concat('-').concat(event.block.timestamp.toString()))
  order.seller = event.params.seller
  order.buyers = event.params.buyers
  order.token = event.params.tokenID.toHexString()
  order.price  = event.params.price
  order.paymentToken = event.params.paymentToken
  order.createdAtTimestamp = event.block.timestamp
  order.createdAtBlockNumber = event.block.number
  order.transactionHash = event.transaction.hash
  order.save()

  _removeOffer(event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString()))

  // update market total data
  let market = Market.load(NFTMarket_ADDRESS)
  market.txCount = market.txCount.plus(BigInt.fromI32(1))
  market.offersCount = market.offersCount.minus(BigInt.fromI32(1))
  if (event.params.paymentToken.toHexString() == ADDRESS_ZERO) {
    market.volumeETH = market.volumeETH.plus(event.params.price)
  } else {
    market.volumeUSD = market.volumeUSD.plus(event.params.price)
  }
  market.save()

  // update daydate
  let day = event.block.timestamp.toI32() / 86400
  let date = day * 86400
  let id = BigInt.fromI32(day).toString()

  let dayData = DayData.load(id)
  if (dayData === null) {
    dayData = new DayData(id)
    dayData.date = date
    dayData.txCount = BigInt.fromI32(1)
    dayData.volumeETH = BigInt.fromI32(0)
    dayData.volumeUSD = BigInt.fromI32(0)
  } else {
    dayData.txCount = dayData.txCount.plus(BigInt.fromI32(1))
    if (event.params.paymentToken.toHexString() == ADDRESS_ZERO) {
      dayData.volumeETH = dayData.volumeETH.plus(event.params.price)
    } else {
      dayData.volumeUSD = dayData.volumeUSD.plus(event.params.price)
    }
  }
  dayData.save()
}

export function handleNoLongerForSale(event: NoLongerForSale): void {
  let offerID = event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString())
  _removeOffer(offerID)

  let market = Market.load(NFTMarket_ADDRESS)
  market.offersCount = market.offersCount.minus(BigInt.fromI32(1))
  market.save()
}

export function handleChangePrice(event: ChangePrice): void {
  let offerID = event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString())
  let offer = Offer.load(offerID)
  offer.price = event.params.price
  offer.paymentToken = event.params.paymentToken
  offer.save()
}

export function handleBidEntered(event: BidEntered): void {
  let offerID = event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString())
  let bidID = event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString()).concat('-').concat(event.block.timestamp.toString())
  let nftID = offerID 

  let offer = Offer.load(offerID)
  if (offer.bidders.length > 0) {
    offer.bidders = event.params.fromAddress.toHexString().concat(',').concat(offer.bidders)
  } else {
    offer.bidders = event.params.fromAddress.toHexString()
  }
  offer.save()

  
  let bid = new Bid(bidID)
  bid.token = nftID
  bid.offer = offerID
  bid.bidder = event.params.fromAddress
  bid.value = event.params.value
  bid.paymentToken = offer.paymentToken
  bid.createdAtTimestamp = event.block.timestamp
  bid.createdAtBlockNumber = event.block.number
  bid.transactionHash = event.transaction.hash
  bid.save()

}

export function handleAuctionPass(event: AuctionPass): void {
  let offerID = event.params.tokenAddress.toHexString().concat('-').concat(event.params.tokenID.toHexString())
  _removeOffer(offerID)

  let market = Market.load(NFTMarket_ADDRESS)
  market.offersCount = market.offersCount.minus(BigInt.fromI32(1))
  market.save()
}
