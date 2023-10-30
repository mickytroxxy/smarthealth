
import { View } from 'react-native';
import { useSearchParams } from 'expo-router';
import CountryList from '../components/modals/CountryList';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setModalTitle } from '../state/slices/modalData';

export default function ModalScreen() {
  const { headerText } = useSearchParams();
  const title: any = headerText;
  const dispatch = useDispatch();

  const COMPONENT_MAP: { [key: string]: any } = {
    SELECT_COUNTRY: CountryList,
    
  };
  const SelectedComponent = COMPONENT_MAP[title?.split(" ").join("_")];
  useEffect(() => {
    if (title) {
      dispatch(setModalTitle(title));
    }
  }, [title, dispatch]);

  return (
    <View style={{flex:1}}>
      {SelectedComponent && <SelectedComponent />}
    </View>
  );
}
