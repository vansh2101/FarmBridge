import React, {useState} from 'react';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';

import StackNav from './routes/StackNav';


export default function App() {
	const [font, setFont] = useState(false);

	const loadFonts = async () => {
		await Font.loadAsync({
			poppins: require('./assets/fonts/poppins.ttf'),
			poppins_bold: require('./assets/fonts/poppins-bold.ttf'),
		})
	}

	if (!font){
		return(
			<AppLoading 
				startAsync={loadFonts}
				onFinish={()=>{setFont(true)}}
				onError={e => console.warn(e)}
			/>
		)
	}

	return(
		<StackNav />
	)
}