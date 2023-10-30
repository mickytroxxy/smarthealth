import React, { memo, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import useLocation from '../../hooks/useLocation';
import Filter from './Filter';
import useUsers from '../../hooks/useUsers';
import Icon from '../ui/Icon';
import * as Animatable from 'react-native-animatable';
import { setActiveUser } from '../../state/slices/users';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';

interface ForeGroundProps {
  // Add any necessary props here
}

const ForeGround: React.FC<ForeGroundProps> = memo(() => {
  const { location } = useLocation();
  const {users} = useUsers();
  const dispatch = useDispatch();
  const router = useRouter();
  const mapView = useRef<MapView>(null);

  const initialRegion: Region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  };

  return (
    <View style={{ flex: 1 }}>
        <Filter/>
        <MapView
            style={styles.mapStyle}
            ref={mapView}
            provider={PROVIDER_GOOGLE}
            region={initialRegion}
            showsCompass={true}
            rotateEnabled={false}
            showsUserLocation={true}
            moveOnMarkerPress={false}
            zoomEnabled={true}
            pitchEnabled={false}
            loadingEnabled={true}
            showsTraffic={true}
        >
            <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
            {users && users.map((item, i) =>  
              <Marker key={i}
                coordinate={{
                latitude: item.address?.latitude || 0,
                longitude: item.address?.longitude || 0
                }}
                onPress={()=> {
                  dispatch(setActiveUser(item));
                  router.push("Profile");
                }}
            >
                <Animatable.View animation="zoomInUp" easing="ease-in-expo" duration={1000} useNativeDriver={true}>
                  <Icon type='FontAwesome' name="user" color="#f9896d" size={24} />
                </Animatable.View>
            </Marker>
            )}
        </MapView>
    </View>
  );
});

export const styles = StyleSheet.create({
  footerStyle: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    elevation: 10,
    paddingBottom: 30,
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default ForeGround;
