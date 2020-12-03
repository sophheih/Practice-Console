import { Address } from "../models/definitions";

export default function isSameAddress(addrA: Address | undefined, addrB: Address |undefined) {
    if (!addrA || !addrB) return false;
    return addrA.id === addrB.id && addrA.city === addrB.city && addrA.district === addrB.district && addrA.detail === addrB.detail;
}
