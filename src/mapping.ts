import { Address,BigInt, store } from '@graphprotocol/graph-ts'
import { Transfer, NFTBazaar as NFTBazaarContract } from '../generated/NFTBazaar/NFTBazaar'
import { Offered, Bought, NoLongerForSale } from '../generated/NFTMarket/NFTMarket'
import { Offered as Offered_v2, BidEntered } from '../generated/NFTMarket_v2/NFTMarket_v2'
import { User, Nft, Offer, Order, Market, DayData, Bid } from '../generated/schema'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const NFTBazaar_ADDRSS = '0x93e97BE3755EC8D54B464F310171c5DE51b1b461'
export const NFTMarket_ADDRSS = '0x88Feb551Ef109685dFEb5962E81a6dcC74E7b6BC'
export const NFTMarket_ADDRSS2 = '0x6509E0f871dAF8ec90210c925714A9a07d7bA418'

function _removeOffer(tokenID: string): void {
  store.remove("Offer", tokenID)
}

export function handleTransfer(event: Transfer): void {
  let from     = event.params.from
  let to       = event.params.to
  let tokenID  = event.params.tokenId
  let contract = NFTBazaarContract.bind(Address.fromString(NFTBazaar_ADDRSS))

  let user = User.load(to.toHexString())
  if (user === null) {
    user = new User(to.toHexString())
    user.save()
  }

  if (from.toHexString() == ADDRESS_ZERO) {
    let nft = new Nft(tokenID.toHexString())
    let tokenUri = contract.tokenURI(tokenID)
    nft.tokenURI = tokenUri
    nft.createdAtTimestamp = event.block.timestamp
    nft.createdAtBlockNumber = event.block.number
    nft.transactionHash = event.transaction.hash
    nft.holder = user.id
    nft.creater = Address.fromString(ADDRESS_ZERO)
    if (event.transaction.from.toHexString() != NFTMarket_ADDRSS && event.transaction.from.toHexString() != NFTMarket_ADDRSS2 ) {
      nft.owner = to
    }
    nft.save()
  } else {
    let nft = Nft.load(tokenID.toHexString())
    nft.holder = to.toHexString()
    if (to.toHexString() != NFTMarket_ADDRSS && to.toHexString() != NFTMarket_ADDRSS2 ) {
      nft.owner = to
    }
    nft.save()
  }
}

export function handleOffered(event: Offered): void {
  let offer = new Offer(event.params.tokenID.toHexString())
  offer.isBid = false
  offer.seller = event.transaction.from
  offer.price = event.params.price
  offer.token = offer.id
  offer.paymentToken = event.params.paymentToken
  offer.endTime = BigInt.fromI32(0)
  offer.createdAtTimestamp = event.block.timestamp
  offer.createdAtBlockNumber = event.block.number
  offer.transactionHash = event.transaction.hash
  offer.contract = event.address
  offer.save()

  let nft = Nft.load(event.params.tokenID.toHexString())
  nft.owner = event.transaction.from
  if (nft.creater == Address.fromString(ADDRESS_ZERO)) {
    nft.creater = event.transaction.from
    nft.save()
  }

  let market = Market.load(NFTMarket_ADDRSS)
  if (market === null) {
    market = new Market(NFTMarket_ADDRSS)
    market.txCount = BigInt.fromI32(0)
    market.offersCount = BigInt.fromI32(1)
    market.volumeETH = BigInt.fromI32(0)
    market.volumeUSD = BigInt.fromI32(0)
  } else {
    market.offersCount = market.offersCount.plus(BigInt.fromI32(1))
  }
  market.save()
}

export function handleOffered_v2(event: Offered_v2): void {
  let offer = new Offer(event.params.tokenID.toHexString())
  offer.isBid = event.params.isBid
  offer.seller = event.params.seller
  offer.price = event.params.price
  offer.token = offer.id
  offer.paymentToken = event.params.paymentToken
  offer.endTime = event.params.endTime
  offer.createdAtTimestamp = event.block.timestamp
  offer.createdAtBlockNumber = event.block.number
  offer.transactionHash = event.transaction.hash
  offer.contract = event.address
  offer.save()

  let nft = Nft.load(event.params.tokenID.toHexString())
  nft.owner = event.transaction.from
  if (nft.creater == Address.fromString(ADDRESS_ZERO)) {
    nft.creater = event.transaction.from
    nft.save()
  }

  let market = Market.load(NFTMarket_ADDRSS)
  if (market === null) {
    market = new Market(NFTMarket_ADDRSS)
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
  let order = new Order(event.params.tokenID.toHexString().concat('-').concat(event.block.timestamp.toString()))
  order.seller = event.params.seller
  order.buyers = event.params.buyers
  order.token = event.params.tokenID.toHexString()
  order.price  = event.params.price
  order.paymentToken = event.params.paymentToken
  order.createdAtTimestamp = event.block.timestamp
  order.createdAtBlockNumber = event.block.number
  order.transactionHash = event.transaction.hash
  order.save()

  _removeOffer(event.params.tokenID.toHexString())

  // update market total data
  let market = Market.load(NFTMarket_ADDRSS)
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
  _removeOffer(event.params.tokenID.toHexString())

  let market = Market.load(NFTMarket_ADDRSS)
  market.offersCount = market.offersCount.minus(BigInt.fromI32(1))
  market.save()
}

export function handleBidEntered(event: BidEntered): void {
  let bid = new Bid(event.params.tokenID.toHexString().concat('-').concat(event.block.timestamp.toString()))
  bid.token = event.params.tokenID.toHexString()
  bid.offer = event.params.tokenID.toHexString()
  bid.bidder = event.params.fromAddress
  bid.value = event.params.value
  bid.createdAtTimestamp = event.block.timestamp
  bid.createdAtBlockNumber = event.block.number
  bid.transactionHash = event.transaction.hash
  bid.save()
}
