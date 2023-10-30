import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../state/store';
import { setPharmacies, setProducts } from '../state/slices/cart';
import { setCartItems } from '../state/slices/cart';
import { showToast } from '../helpers/methods';
import { useRouter } from 'expo-router';
import useUpdates from './useUpdates';
export type PharmacyType ={
    id: number,
    name: string,
    distance_km: number,
    description: string,
    image: string,
    selected?: boolean,
}
const global_pharmacies:PharmacyType[] = [
    {
      "id": 1,
      "name": "Healthy Pharmacy",
      "description": "Your one-stop shop for health and wellness products.",
      "image": "https://picsum.photos/200/200?image=1",
      "distance_km": 1.5,
      "selected":true
    },
    {
      "id": 2,
      "name": "Wellness Rx Pharmacy",
      "description": "Providing quality pharmaceutical services for your well-being.",
      "image": "https://picsum.photos/200/200?image=2",
      "distance_km": 2.3
    },
    {
      "id": 3,
      "name": "MediCare Corner",
      "description": "Where your health is our top priority.",
      "image": "https://picsum.photos/200/200?image=3",
      "distance_km": 3.1
    },
    {
      "id": 4,
      "name": "Pharma Plus",
      "description": "Your trusted neighborhood pharmacy for all your medical needs.",
      "image": "https://picsum.photos/200/200?image=4",
      "distance_km": 4.0
    },
    {
      "id": 5,
      "name": "QuickScript Pharmacy",
      "description": "Fast and reliable prescription services at your convenience.",
      "image": "https://picsum.photos/200/200?image=5",
      "distance_km": 5.2
    }
]
export type ProductType ={
    product_id: number,
    product_name: string,
    price: number,
    description: string,
    image: string,
    category: string,
    quantity?:number
}
const global_products:ProductType[] = [
    {
      "product_id": 101,
      "product_name": "Pain Relief Tablets",
      "price": 9.99,
      "description": "Effective pain relief tablets for headaches and body aches.",
      "image": "https://picsum.photos/200/200?image=101",
      "category": "Pain Relief"
    },
    {
      "product_id": 102,
      "product_name": "Vitamins and Supplements",
      "price": 14.99,
      "description": "A variety of vitamins and supplements for better health.",
      "image": "https://picsum.photos/200/200?image=102",
      "category": "Wellness"
    },
    {
      "product_id": 103,
      "product_name": "Allergy Medication",
      "price": 12.99,
      "description": "Relieve allergy symptoms with our trusted medication.",
      "image": "https://picsum.photos/200/200?image=103",
      "category": "Allergy"
    },
    {
      "product_id": 104,
      "product_name": "First Aid Kit",
      "price": 19.99,
      "description": "Be prepared for emergencies with our comprehensive first aid kit.",
      "image": "https://picsum.photos/200/200?image=104",
      "category": "First Aid"
    },
    {
      "product_id": 105,
      "product_name": "Prescription Medications",
      "price": 34.99,
      "description": "Quality prescription medications for various health conditions.",
      "image": "https://picsum.photos/200/200?image=105",
      "category": "Prescription"
    },
    {
      "product_id": 106,
      "product_name": "Cough and Cold Remedies",
      "price": 7.99,
      "description": "Relieve cold and cough symptoms with our remedies.",
      "image": "https://picsum.photos/200/200?image=106",
      "category": "Cold and Flu"
    },
    {
      "product_id": 107,
      "product_name": "Dental Care Products",
      "price": 5.99,
      "description": "Maintain your oral health with our dental care products.",
      "image": "https://picsum.photos/200/200?image=107",
      "category": "Dental Care"
    },
    {
      "product_id": 108,
      "product_name": "Skin Care Lotions",
      "price": 8.99,
      "description": "Keep your skin healthy and moisturized with our lotions.",
      "image": "https://picsum.photos/200/200?image=108",
      "category": "Skin Care"
    },
    {
      "product_id": 109,
      "product_name": "Prescription Refills",
      "price": 29.99,
      "description": "Quick and easy prescription refills for your convenience.",
      "image": "https://picsum.photos/200/200?image=109",
      "category": "Prescription"
    },
    {
      "product_id": 110,
      "product_name": "Medical Equipment",
      "price": 49.99,
      "description": "A range of medical equipment for your healthcare needs.",
      "image": "https://picsum.photos/200/200?image=110",
      "category": "Medical Equipment"
    }
]

const useCart = () => {
    const dispatch = useDispatch();
    const accountInfo = useSelector((state: RootState) => state.accountInfo);
    const router = useRouter();
    const {handleChange:handleBalanceChange} = useUpdates();
    const { pharmacies,products, cartItems } = useSelector((state: RootState) => state.cart);
    const selectedPharmacy = pharmacies.filter(item => item.selected)[0];
    const [formData,setFormData] = useState({address:'',phoneNumber:'',notes:''})
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    const total = cartItems?.reduce((total: number, obj: ProductType) => total + (obj.quantity || 0) * obj.price, 0);
    const handleChange = (field:string,value:string) => setFormData(v =>({...v, [field] : value}));
    const handleCartAction = (product: ProductType, action: 'add' | 'remove') => {
        const existingItem = cartItems.find((item) => item?.product_id === product.product_id);
        if (action === 'add') {
          if (existingItem) {
            dispatch(setCartItems(cartItems.map((item) => (item.product_id === product.product_id ? { ...item, quantity: (item.quantity || 0) + 1 } : item))))
          } else {
            dispatch(setCartItems([...cartItems, { ...product, quantity: 1 }]))
          }
        } else if (action === 'remove') {
          if (existingItem && existingItem.quantity && existingItem.quantity > 1) {
            dispatch(setCartItems(cartItems.map((item) => (item.product_id === product.product_id ? { ...item, quantity: (item.quantity || 0) - 1 } : item))))
          } else {
            dispatch(setCartItems(cartItems.filter((item) => item.product_id !== product.product_id)))
          }
        }
    };
    const handlePurchase = async () => {
        if(parseFloat(accountInfo.balance) >= total){
            const balance = parseFloat(accountInfo.balance) - total;
            handleBalanceChange('balance',balance);
            dispatch(setCartItems([]))
            router.push('PurchaseSuccess')
        }else{
            showToast("You have a low balance to place this purchase!")
        }
    }
    useEffect(() => {
       dispatch(setPharmacies(global_pharmacies))
       dispatch(setProducts(global_products))
       handleChange('phoneNumber',accountInfo.phoneNumber)
    }, []);

    return {pharmacies,uniqueCategories,handlePurchase,products,handleCartAction,cartItems,selectedPharmacy,total,setPharmacies,formData,handleChange};
};

export default useCart;
