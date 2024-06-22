import { Product } from '@/payload-types'
import { create } from 'zustand'
import {
    createJSONStorage,
    persist,
} from 'zustand/middleware'

export type CartItem = {
    product: Product
}

type DeliveryMethod = 'pickup' | 'delivery'
type ShippingMethod = 'UPS' | 'FedEx'

type ContactInfo = {
    name: string
    email: string
    phone: string
}

type Address = {
    addressOne: string
    addressTwo: string
    city: string
    state: string
    country: string
    zip: string
}
type CartState = {
    deliveryMethod: DeliveryMethod
    contactInfo: ContactInfo
    shippingMethod: ShippingMethod
    address: Address
    fflDealerId: string
    specialInstructions: string
    fflCertificate: any
    termsAndConditions: any
    // setCheckoutInfo: (checkoutInfo: CartState) => void
    // removeItem: (productId: string) => void
    // clearCart: () => void
}

const initialState: CartState = {
    deliveryMethod: 'pickup',
    contactInfo: { name: '', email: '', phone: '' },
    shippingMethod: 'UPS',
    address: { addressOne: '', addressTwo: '', city: '', state: '', zip: '', country: '' },
    fflDealerId: '',
    specialInstructions: '',
    fflCertificate: null, // Consider using a more descriptive type (e.g., File)
    termsAndConditions: false, // Default to unchecked for terms and conditions
};

export const useCheckoutStore = create<CartState>()(
    persist(
        (set) => ({
            ...initialState,
            setCheckoutInfo: (checkoutInfo: CartState) =>
                set((state) => ({ ...state, ...checkoutInfo }))
            // setDeliveryMethod: (deliveryMethod: DeliveryMethod) =>
            //     set((state) => ({ ...state, deliveryMethod })),
            // setContactInfo: (contactInfo: ContactInfo) =>
            //     set((state) => ({ ...state, contactInfo })),
            // setShippingMethod: (shippingMethod: ShippingMethod) =>
            //     set((state) => ({ ...state, shippingMethod })),
            // setAddress: (address: Address) =>
            //     set((state) => ({ ...state, address })),
            // setFflDealerId: (fflDealerId: string) =>
            //     set((state) => ({ ...state, fflDealerId })),
            // setSpecialInstructions: (specialInstructions: string) =>
            //     set((state) => ({ ...state, specialInstructions })),
            // setFflCertificate: (fflCertificate: any) => // Update type if necessary
            //     set((state) => ({ ...state, fflCertificate })),
            // setTermsAndConditions: (termsAndConditions: boolean) =>
            //     set((state) => ({ ...state, termsAndConditions })),
        }),
        {
            name: 'checkout-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)