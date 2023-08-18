import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, FlatList, Animated, Platform, TextInput } from 'react-native';
import { useFonts } from 'expo-font';
import CircularProgressBar from '../../components/CircleProgress'
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import AppBtn from '../../components/Button';
import NameAvatar from '../../components/NameAvatar';
import Header from '../../components/Header';
import DropDownComponent from '../../components/DropDown';
import { Dimensions } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import app from '../config/firebase';
import { getAuth } from 'firebase/auth';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";

const driverOptionList = ['Inspection'];
const assetOptionList = ['Inspection', 'Defects'];

const ProfilePage = (props) => {

  const db = getFirestore(app)
  const auth = getAuth()
  const storage = getStorage(app);

  const [selectedPage, setSelectedPage] = useState('Inspection');
  const [dashboardHovered, setDashboardHovered] = useState(false)
  const [inspectiondHovered, setInspectionHovered] = useState(false)
  const [maintenanceHovered, setMaintenanceHovered] = useState(false)
  const [fadeAnim] = useState(new Animated.Value(0));
  const [assetsHovered, setAssetsHovered] = useState(false)
  const [usersHovered, setUsersHovered] = useState(false)
  const [driverSelectedOption, setDriverSelectedOption] = useState('Inspection');
  const [assetSelectedOption, setAssetSelectedOption] = useState('Inspection');
  const [dashboardCalendarSelect, setDashboardCalendarSelect] = useState('Today')
  const { height, width } = Dimensions.get('window');
  const [textInputBorderColor, setTextInputBorderColor] = useState('')
  const [fileUri, setFileUri] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [number, setNumber] = useState('')
  const [workPhone, setWorkPhone] = useState('')
  const [dob, setDob] = useState('')
  const [role, setRole] = useState('')
  const [fileuploading, setFileuploading] = useState(0)
  const [uploadingStatus, setUploadingStatus] = useState(false)



  const fetchData = async () => {
    const querySnapshot = await getDocs(collection(db, 'DVIR'));
    const dbData = []
    let i = 0
    querySnapshot.forEach(async (doc) => {
      if (auth.currentUser.email == doc.data().Email) {
        setFirstName(doc.data().FirstName)
        setLastName(doc.data().LastName)
        setEmail(doc.data().Email)
        setCompany(doc.data().Company)
        setNumber(doc.data().Number)
        setWorkPhone(doc.data().WorkPhone)
        setDob(doc.data().dob)
        setRole(doc.data().Role)
      }
      await getDocs(collection(db, `DVIR/${doc.data().Email}/users`))
        .then((newQuery) => {
          newQuery.forEach((docs) => {
            if (getAuth().currentUser.email == docs.data().Email) {
              setFirstName(docs.data().FirstName)
              setLastName(docs.data().LastName)
              setEmail(docs.data().Email)
              setCompany(docs.data().Company)
              setNumber(docs.data().Number)
              setWorkPhone(docs.data().WorkPhone)
              setDob(docs.data().dob)
              setRole(docs.data().Role)
            }
          })
        })
    });
  }

  useEffect(() => {
    fetchData()
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false
    }).start();

    return () => {
      fadeAnim.setValue(0);
    }

  }, [])

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*', // Change the MIME type to specify the type of files you want to allow
      });
      if (result.assets[0].uri) {
        uploadImage(result.assets[0].uri)
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
    setUploadingStatus(false)
  };

  const uploadImage = async (resultimage) => {
    // convert image to blob image
    const blobImage = await new Promise((resole, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resole(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", resultimage, true);
      xhr.send(null);
    });

    // Create the file metadata
    /** @type {any} */
    const metadata = {
      contentType: 'image/jpeg'
    };

    //upload image to firestore
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'ProfileImages/' + getAuth().currentUser.email + '.dp');
    const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

    uploadTask.on('state_changed',
      (snapshot) => {

        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFileuploading(Math.round(progress))


        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log('File available at', downloadURL)
          
          setFileUri(downloadURL)
        });
      }
    );
  }


  const [fontsLoaded] = useFonts({
    'futura-extra-black': require('../../assets/fonts/Futura-Extra-Black-font.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }


  return (
    <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
      {/* <ScrollView style={{height:100}}> */}
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflow: 'hidden', height: height }}>
        <LinearGradient colors={['#AE276D', '#B10E62']} style={styles.gradient3} />
        <LinearGradient colors={['#2980b9', '#3498db']} style={styles.gradient1} />
        <LinearGradient colors={['#678AAC', '#9b59b6']} style={styles.gradient2} />
        <LinearGradient colors={['#EFEAD2', '#FAE2BB']} style={styles.gradient4} />
      </View>
      <BlurView intensity={100} tint="light" style={StyleSheet.absoluteFill} />

      <ScrollView style={{ height: 100 }}>
        <View style={{ flexDirection: 'row', marginLeft: 40, marginTop: 40, alignItems: 'center' }}>
          <View style={{ backgroundColor: '#67E9DA', borderRadius: 15, }}>
            <Image style={{ width: 30, height: 30, margin: 10 }}
              tintColor='#FFFFFF'
              source={require('../../assets/dashboard_speed_icon.png')}></Image>
          </View>
          <Text style={{ fontSize: 40, color: '#1E3D5C', fontWeight: '900', marginLeft: 10 }}>
            My Profile
          </Text>
        </View>

        <View style={styles.contentCardStyle}>
          <ScrollView horizontal style={{ paddingBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

              <View style={{ flexDirection: 'column', }}>
                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>First Name*</Text>
                  <TextInput
                    style={[styles.input, textInputBorderColor == 'First Name' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                    placeholderTextColor="#868383DC"
                    value={firstName}
                    // onChangeText={{}}
                    onFocus={() => { setTextInputBorderColor('First Name') }}
                    onBlur={() => { setTextInputBorderColor('') }}
                  />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Last Name*</Text>
                  <TextInput
                    style={[styles.input, textInputBorderColor == 'Last Name' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                    placeholderTextColor="#868383DC"
                    value={lastName}
                    // onChangeText={{}}
                    onFocus={() => { setTextInputBorderColor('Last Name') }}
                    onBlur={() => { setTextInputBorderColor('') }}
                  />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Email</Text>
                  <TextInput
                    style={[styles.input, textInputBorderColor == 'Email' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                    placeholderTextColor="#868383DC"
                    value={email}
                    // onChangeText={{}}
                    onFocus={() => { setTextInputBorderColor('Email') }}
                    onBlur={() => { setTextInputBorderColor('') }}
                  />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Company</Text>
                  <TextInput
                    style={[styles.input, textInputBorderColor == 'Company' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                    placeholderTextColor="#868383DC"
                    value={company}
                    // onChangeText={{}}
                    onFocus={() => { setTextInputBorderColor('Company') }}
                    onBlur={() => { setTextInputBorderColor('') }}
                  />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Role</Text>
                  <TextInput
                    style={[styles.input, textInputBorderColor == 'Role' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                    placeholderTextColor="#868383DC"
                    value={role}
                    // onChangeText={{}}
                    onFocus={() => { setTextInputBorderColor('Role') }}
                    onBlur={() => { setTextInputBorderColor('') }}
                  />
                </View>

                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Mobile Phone*</Text>
                  <TextInput
                    style={[styles.input, textInputBorderColor == 'Mobile Phone' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                    placeholderTextColor="#868383DC"
                    value={number}
                    // onChangeText={{}}
                    onFocus={() => { setTextInputBorderColor('Mobile Phone') }}
                    onBlur={() => { setTextInputBorderColor('') }}
                  />
                </View>
              </View>
              <View style={{ flexDirection: 'column', marginLeft: 80, }}>

                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Photo</Text>
                  <View style={{ flexDirection: 'column', marginLeft: 100, }}>
                    {fileUri
                      ?
                      <TouchableOpacity onPress={()=>{
                        setUploadingStatus(true)
                        pickDocument()}}>
                        <Image style={{ height: 200, width: 200, borderRadius: 5 }} source={{ uri: fileUri }} />
                      </TouchableOpacity>
                      :
                      <TouchableOpacity style={{ height: 180, width: 180, borderRadius: 90, borderColor: '#cccccc', borderWidth: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }} onPress={pickDocument}>

                        <Image style={{ height: 20, width: 20 }}
                          source={require('../../assets/add_photo_icon.png')}
                          tintColor='#67E9DA'></Image>
                        <Text style={{ color: '#30E0CB' }}>Add Photo</Text>

                      </TouchableOpacity>
                    }
                    {uploadingStatus == true 
                    ?<Text style={{ marginTop: 10, alignSelf: 'center' }}>Uploading: {fileuploading}%</Text> 
                    : null}
                   
                  </View>
                </View>


                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Work Phone</Text>
                  <TextInput
                    style={[styles.input, textInputBorderColor == 'Work Phone' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                    placeholderTextColor="#868383DC"
                    value={workPhone}
                    // onChangeText={{}}
                    onFocus={() => { setTextInputBorderColor('Work Phone') }}
                    onBlur={() => { setTextInputBorderColor('') }}
                  />
                </View>


                <View style={{ flexDirection: 'row', marginTop: 30, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' }}>Date of Birth</Text>
                  <TextInput
                    style={[styles.input, textInputBorderColor == 'Date of Birth' && styles.withBorderInputContainer /*&& styles.withBorderInputContainer*/]}
                    placeholderTextColor="#868383DC"
                    value={dob}
                    // onChangeText={{}}
                    onFocus={() => { setTextInputBorderColor('Date of Birth') }}
                    onBlur={() => { setTextInputBorderColor('') }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </Animated.View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#FFFFFF',
    fontFamily: 'futura-extra-black',
    alignSelf: 'center'
  },
  leftSide: {
    width: 270,
    backgroundColor: '#1E3D5C',
    paddingTop: 50,
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  navItem: {
    height: 50,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 15,
    alignItems: 'center',
    paddingLeft: 20,
    flexDirection: 'row',
    marginBottom: 10

    // borderBottomWidth: 1,
    // borderBottomColor: '#ccc',
  },
  selectedNavItem: {
    // backgroundColor: '#ccc',
    height: 50,
    width: '90%',
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 15,
    alignItems: 'center',
    paddingLeft: 20,
    backgroundColor: '#1383B4',

  },
  navText: {
    fontSize: 14,
    color: '#67E9DA',
    fontWeight: '700',
    opacity: 0.6
  },
  navTextHover: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    opacity: 1,
    fontSize: 16
  },

  contentContainer: {
    flex: 1,
    overflow: 'hidden'
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  hoverNavItem: {
    backgroundColor: '#1383B4',

  },
  dropdown: {
    // Custom styles for the dropdown container
    // For example:
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minWidth: 150,
  },
  dropdownProfile: {
    padding: 12,
    minWidth: 100,
  },

  text: {
    // Custom styles for the text inside dropdown and selected value
    // For example:
    color: '#000000',
  },
  gradient1: {
    ...StyleSheet.absoluteFill,
    opacity: 0.8,
  },
  gradient2: {
    ...StyleSheet.absoluteFill,
    opacity: 0.6,
    transform: [{ rotate: '45deg' }],
  },
  gradient3: {
    ...StyleSheet.absoluteFill,
    opacity: 0.4,
    transform: [{ rotate: '90deg' }],
  },
  gradient4: {
    ...StyleSheet.absoluteFill,
    opacity: 0.2,
    transform: [{ rotate: '135deg' }],
  },
  driverAndAssetAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  calenderSortText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#5B5B5B',
  },
  calenderSortSelectedText: {
    color: '#000000',
    borderBottomWidth: 4,
    borderBottomColor: '#67E9DA',
    paddingBottom: 10
  },
  subHeadingText: {
    color: '#1E3D5C',
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
    margin: 10
  },
  contentCardStyle: {
    backgroundColor: '#FFFFFF',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    margin: 40,
    flex: 1
  },
  btn: {
    width: '100%',
    height: 50,
    backgroundColor: '#336699',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginRight: 10
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1
  },
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    minWidth: 150,

  },
  dropdownSelectedValueStyle: {
    fontSize: 16,
  },
  dropdownOptionsContainer: {
    position: 'absolute',
    top: '100%',
    right: 0,
    left: 0,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginTop: 4,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Add boxShadow for web
      },
    }),

  },
  dropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownHoveredOption: {
    ...(Platform.OS === 'web' && {
      backgroundColor: '#67E9DA',
      cursor: 'pointer',
      transitionDuration: '0.2s',
    }),
  },
  dropdownOptionText: {
    fontSize: 16,
  },
  dropdownHoveredOptionText: {
    ...(Platform.OS === 'web' && {
      color: '#FFFFFF',
    }),
  },
  dropdownButtonSelect: {
    borderColor: '#558BC1',
    shadowColor: '#558BC1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 0,
  },
  input: {
    width: 350,
    height: 40,
    marginLeft: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    outlineStyle: 'none'
  },
  withBorderInputContainer: {
    borderColor: '#558BC1',
    shadowColor: '#558BC1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 0,
  },
});

export default ProfilePage