import {useEffect} from 'react';
import { useSearchParams } from "react-router-dom"

export const Room = () =>{
    const [searchParams, setSearchParams] = useSearchParams();
    const name = searchParams.get('name');
    console.log('In room')
    useEffect(()=>{

    },[name]);
    return <div>
        hi, {name}
    </div>
}