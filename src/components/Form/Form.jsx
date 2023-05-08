import React, { useEffect, useState, useCallback } from "react"
import { useTelegram } from "../../hooks/useTelegram";
import './Form.css';

const Form = () => {
    const [id, setId] = useState('');
    const [country, setCountry] = useState('');
    const [street, setStreet] = useState('');
    const [subject, setSubject] = useState('physical');
    const {tg} = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            id,
            country,
            street,
            subject
        }
        tg.sendData(JSON.stringify(data));
    }, [id, country, street, subject])

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.MainButton.setParams({
            text: 'Отправить данные'
        })
    }, [])

    useEffect(() => {
        if(!street || !country || !id) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [id, country, street])

    const onChangeId = (e) => {
        setId(e.target.value)
    }

    const onChangeCountry = (e) => {
        setCountry(e.target.value)
    }

    const onChangeStreet = (e) => {
        setStreet(e.target.value)
    }

    const onChangeSubject = (e) => {
        setSubject(e.target.value)
    }

    return (
        <div className={"form"}>
            <h3>Введите ваши данные</h3>
                <input className={'input'} type="text" placeholder={'id, почта, номер телефона для связи'} value={id} onChange={onChangeId}/>
                <input className={'input'} type="text" placeholder={'Город'} value={country} onChange={onChangeCountry}/>
                <input className={'input'} type="text" placeholder={'Улица'} value={street} onChange={onChangeStreet}/>
            <select value={subject} onChange={onChangeSubject} className={'select'}>
                <option value={'physical'}>без доупа</option>
                <option value={'legal'}>1г в подарок</option>
            </select>
        </div>
    );
};

export default Form;