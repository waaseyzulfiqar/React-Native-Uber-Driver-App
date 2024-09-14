// import {
//   StyleSheet,
//   View,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   Button,
// } from "react-native";
// import MapView from "react-native-maps";
// import { useState, useEffect } from "react";

// import * as Location from "expo-location";

// import { Marker } from "react-native-maps";

// import {
//   query,
//   collection,
//   db,
//   where,
//   onSnapshot,
//   doc,
//   updateDoc,
// } from "../../config/firebase";

// export default function HomeScreen() {
//   const [location, setLocation] = useState<any>(null);
//   const [errorMsg, setErrorMsg] = useState<any>(null);
//   const [rides, setRides] = useState<any[]>([]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     findLocation();
//     getRealTimeRides();
//   }, []);

//   function findLocation() {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync();
//       setLocation(location);
//     })();
//   }

//   function getRealTimeRides() {
//     const q = query(collection(db, "Ride"), where("status", "==", "pending"));
//     onSnapshot(q, (querySnapshot) => {
//       const ride: any = [];
//       querySnapshot.forEach((doc) => {
//         if (doc) {
//           ride.push({ id: doc.id, ...doc.data()});
//         }      
//       });
//       setRides(ride)
//       console.log("Current rides: ", ride);
//       console.log("Current rides Id: ", ride[currentIndex].id);
//     });
//   }

//   function handleAccept(rideId: string) {
//     const rideRef = doc(db, "Ride", rideId);
//     updateDoc(rideRef, {
//       status: "accepted",
//     })
//       .then(() => {
//         console.log("Ride accepted");
//         setRides([])
//         setCurrentIndex(0)
//       })
//       .catch((error) => {
//         console.error("Error updating document: ", error);
//       });
//   }

//   function handleReject(rideId: string) {
//     const rideRef = doc(db, "Ride", rideId);
//     updateDoc(rideRef, {
//       status: "rejected",
//     })
//       .then(() => {
//         console.log("Ride rejected");
//         const newRides = rides.filter((ride) => ride.id !== rideId);
//         setRides(newRides);
//         if (newRides.length > 0) {
//           setCurrentIndex(0);
//         }
//       })
//       .catch((error) => {
//         console.error("Error updating document: ", error);
//       });
//   }

  
//   return (
//     <View style={styles.container}>
//       {!!rides.length && currentIndex >= 0 && currentIndex < rides.length && (
//         <View
//           style={{
//             marginLeft: 20,
//             marginRight: 20,
//             paddingBottom: 10,
//             borderBottomColor: "#222",
//             borderBottomWidth: 1,
//           }}
//         >
//           <Text style={{ textAlign: "center", fontSize: 20, marginBottom: 10 }}>
//             Ride Requested
//           </Text>
//           <Text style={{ marginBottom: 10 }}>
//             Pickup:
//             {rides[currentIndex].pickup.pickupAddress ||
//               rides[currentIndex].pickup.pickupName}
//           </Text>
//           <Text style={{ marginBottom: 10 }}>
//             DropOff:
//             {rides[currentIndex].dropOff.dropoffAddress ||
//               rides[currentIndex].dropOff.dropoffName}
//           </Text>
//           <Text>Fare: {rides[currentIndex].fare}</Text>

//           <View style={{ flexDirection: "row", marginTop: 10 }}>
//             <View style={{ marginRight: 10 }}>
//               <Button
//                 title="Reject"
//                 onPress={() => handleReject(rides[currentIndex].id)}
//               />
//             </View>
//             <Button
//               title="Accept"
//               onPress={() => handleAccept(rides[currentIndex].id)}
//             />
//           </View>
//         </View>
//       )}
//       {location && (
//         <MapView
//           style={styles.mapview}
//           region={{
//             latitude: location.coords.latitude,
//             longitude: location.coords.longitude,
//             latitudeDelta: 0.0002,
//             longitudeDelta: 0.0001,
//           }}
//         >
//           <Marker
//             coordinate={{
//               latitude: location.coords.latitude,
//               longitude: location.coords.longitude,
//             }}
//             title={"My Home"}
//           />
//         </MapView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 50,
//   },
//   mapview: {
//     width: "100%",
//     height: "100%",
//   },
// });



import {
  StyleSheet,
  View,
  Button,
  Text,
} from "react-native";
import MapView from "react-native-maps";
import { useState, useEffect } from "react";

import * as Location from "expo-location";
import { Marker } from "react-native-maps";

import {
  query,
  collection,
  db,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "../../config/firebase";

export default function HomeScreen() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<any>(null);
  const [rides, setRides] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    findLocation();
    getRealTimeRides();
  }, []);

  function findLocation() {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync();
      setLocation(location);
    })();
  }

  function getRealTimeRides() {
    const q = query(collection(db, "Ride"), where("status", "==", "pending"));
    onSnapshot(q, (querySnapshot) => {
      const ride: any = [];
      querySnapshot.forEach((doc) => {
        if (doc) {
          ride.push({ id: doc.id, ...doc.data() });
        }
      });
      setRides(ride);
      if (ride.length > 0) {
        setCurrentIndex(0); // Reset index to 0 when new data comes in
      }
      console.log("Current rides: ", ride);
    });
  }

  function handleAccept(rideId: string) {
    if (!rideId) return; // Ensure rideId is valid

    const rideRef = doc(db, "Ride", rideId);
    updateDoc(rideRef, {
      status: "accepted",
    })
      .then(() => {
        console.log("Ride accepted");
        setRides([]); // Clear rides after acceptance
        setCurrentIndex(0); // Reset index
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  }

  function handleReject(rideId: string) {
    if (!rideId) return; // Ensure rideId is valid

    const rideRef = doc(db, "Ride", rideId);
    updateDoc(rideRef, {
      status: "rejected",
    })
      .then(() => {
        console.log("Ride rejected");
        const newRides = rides.filter((ride) => ride.id !== rideId);
        setRides(newRides);
        if (newRides.length > 0) {
          setCurrentIndex(0); // Reset index after rejection
        }
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={{color: '#fff', textAlign: 'center', paddingBottom: 5, fontSize: 20, fontWeight: 'bold'}}>Driver App</Text>
      {!!rides.length && currentIndex >= 0 && currentIndex < rides.length && (
        
        <View
          style={{
            marginLeft: 20,
            marginRight: 20,
            paddingBottom: 10,
            borderBottomColor: "#222",
            borderBottomWidth: 1,
          }}
        >
          <Text style={{ textAlign: "center", fontSize: 20, marginBottom: 10, color: '#fff' }}>
            Ride Requested
          </Text>
          <Text style={{ marginBottom: 10, color: '#fff' }}>
            Pickup:
            {rides[currentIndex]?.pickup?.pickupAddress ||
              rides[currentIndex]?.pickup?.pickupName}
          </Text>
          <Text style={{ marginBottom: 10, color: '#fff' }}>
            DropOff:
            {rides[currentIndex]?.dropOff?.dropoffAddress ||
              rides[currentIndex]?.dropOff?.dropoffName}
          </Text>
          <Text style={{color: '#fff'}}>Fare: {rides[currentIndex]?.fare} Rs</Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ marginRight: 10 }}>
              <Button
                title="Reject"
                onPress={() => handleReject(rides[currentIndex]?.id)}
              />
            </View>
            <Button
              title="Accept"
              onPress={() => handleAccept(rides[currentIndex]?.id)}
            />
          </View>
        </View>
      )}
      {location && (
        <MapView
          style={styles.mapview}
          region={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0002,
            longitudeDelta: 0.0001,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title={"My Home"}
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  mapview: {
    width: "100%",
    height: "100%",
  },
});
