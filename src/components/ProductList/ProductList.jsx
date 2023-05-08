import React, {useCallback, useEffect, useState} from "react";
import './ProductList.css';
import ProductItem from "../ProductItem/ProductItem";
import {useTelegram} from "../../hooks/useTelegram";


const products = [
    {id: '1', title: 'Dont Smoke', price: 2280, description: '250гр/м2, 95% хлопок/ 5% лайкра. Размеры S/M/L в наличии!', imageUrl: './img1.png'},
    {id: '2', title: 'Comming Soon!', price: 0, description: 'Возможность для заказа появится позже!', imageUrl: './img2.png'},
    {id: '3', title: 'Сomming Soon!', price: 0, description: 'Возможность для заказа появится позже!', imageUrl: './img3.png'},
    {id: '4', title: 'Comming Soon!', price: 0, description: 'Возможность для заказа появится позже!', imageUrl: './img4.png'},
    {id: '5', title: 'Comming Soon!', price: 0, description: 'Возможность для заказа появится позже!', imageUrl: './img5.png'},
    {id: '6', title: 'Comming Soon!', price: 0, description: 'Возможность для заказа появится позже!', imageUrl: './img6.png'},
    // {id: '7', title: 'Джинсы 4', price: 5500, description: 'Синего цвета, прямые', imageUrl: './img1.png'},
    // {id: '8', title: 'Куртка 5', price: 12000, description: 'Зеленого цвета, теплая'},
]

const getTotalPrice = (items = []) => {
    return items.reduce((acc, item) => {
        return acc += item.price
    }, 0)
}
const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const {tg, queryId} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        }
        fetch('http://localhost:8000', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
    }, [addedItems])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find(item => item.id === product.id);
        let newItems = [];
        newItems = [...addedItems, product];
        // if(alreadyAdded) {
        //     newItems = addedItems.filter(item => item.id !== product.id);
        // } else {
        //     newItems = [...addedItems, product];
        // }

        setAddedItems(newItems)

        if(newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`
            })
        }
    }

    return (
        <div className={'list'}>
            {products.map(item => (
                <ProductItem product={item} onAdd={onAdd} className={'item'}/>
            ))}
        </div>
    );
};

export default ProductList;