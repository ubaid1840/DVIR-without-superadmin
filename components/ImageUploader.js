import React, { useState } from 'react';
// import firebase from 'firebase/app';
// import 'firebase/storage';

const ImageUploader = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = () => {
    if (selectedImage) {
      const storageRef = firebase.storage().ref();
      const imageRef = storageRef.child(selectedImage.name);

      imageRef.put(selectedImage).then((snapshot) => {
        console.log('Uploaded a file!', snapshot);
      });
    } else {
      console.log('No image selected.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button >Upload</button>
    </div>
  );
};

export default ImageUploader;
