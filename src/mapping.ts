import { Address } from '@graphprotocol/graph-ts'
import { Transfer, NFTBazaar } from '../generated/NFTBazaar/NFTBazaar'
import { User, Nft } from '../generated/schema'

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'
export const NFTBazaar_ADDRSS = '0x0663b99715199d78850836Ba93dd479955E5105D'

export function handleTransfer(event: Transfer): void {
  let from     = event.params.from
  let to       = event.params.to
  let tokenID  = event.params.tokenId
  let contract = NFTBazaar.bind(Address.fromString(NFTBazaar_ADDRSS))

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
