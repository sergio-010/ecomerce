import Image from "next/image"
import Link from "next/link"
import { CartButton } from "./CartButton"
import { StoreConfig } from "@/types"

interface Props {
    config: StoreConfig
}

export function StoreHeader({ config }: Props) {
    return (
        <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm bg-white">
            <Link href="/" className="flex items-center gap-3">
                <Image src={config.logo || "/placeholder.svg"} alt="logo" width={40} height={40} />
                <span className="text-xl font-bold text-gray-900">{config.name}</span>
            </Link>
            <CartButton />
        </header>
    )
}
