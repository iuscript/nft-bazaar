import { Address, BigInt, store } from '@graphprotocol/graph-ts'
import { Transfer, NFTBazaar as NFTBazaarContract } from '../generated/NFTBazaar/NFTBazaar'
import { Offered, Bought, NoLongerForSale } from '../generated/NFTMarket/NFTMarket'
import { User, Nft, Offer, Order, Market, DayData } from '../generated/schema'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const NFTBazaar_ADDRSS = '0x0663b99715199d78850836Ba93dd479955E5105D'
export const NFTMarket_ADDRSS = '0xc839EB991094D611e08bc1C236f37551529aE534'

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
    nft.holder = user.id
    nft.save()
  } else {
    let nft = Nft.load(tokenID.toHexString())
    nft.holder = to.toHexString()
    nft.save()
  }
}

export function handleOffered(event: Offered): void {
  let offer = new Offer(event.params.tokenID.toHexString())
  offer.seller = event.transaction.from
  offer.price = event.params.price
  offer.tokenID = offer.id
  offer.paymentToken = event.params.paymentToken
  offer.createdAtTimestamp = event.block.timestamp
  offer.createdAtBlockNumber = event.block.number
  offer.transactionHash = event.transaction.hash
  offer.save()

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
  order.tokenID = event.params.tokenID.toHexString()
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
}

export function handleNoLongerForSale(event: NoLongerForSale): void {
  _removeOffer(event.params.tokenID.toHexString())

  let market = Market.load(NFTMarket_ADDRSS)
  market.offersCount = market.offersCount.minus(BigInt.fromI32(1))
  market.save()
}
