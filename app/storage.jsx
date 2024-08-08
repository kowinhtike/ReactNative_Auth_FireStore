import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Video } from "expo-av";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";
import Slider from "@react-native-community/slider";

const addpost = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 14],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  const pickVideo = async () => {
    // Request permission to access the media library
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launch the video picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri); // Set the selected video URI
    }
  };

  const uploadImage = async () => {
    if (selectedImage == null) return;

    setUploading(true);

    const response = await fetch(selectedImage);
    const blob = await response.blob();
    const filename = selectedImage.substring(
      selectedImage.lastIndexOf("/") + 1
    );

    const storageRef = ref(storage, `images/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress monitoring if needed
        // Handle progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //console.log("File available at", downloadURL);
          setUrl(downloadURL);
          setUploading(false);
          setUploadProgress(0);
        });
      }
    );
  };

  const uploadVideo = async () => {
    if (selectedVideo == null) return;

    setUploading(true);

    const response = await fetch(selectedVideo);
    const blob = await response.blob();
    const filename = selectedVideo.substring(
      selectedVideo.lastIndexOf("/") + 1
    );

    const storageRef = ref(storage, `videos/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Progress monitoring if needed
        // Handle progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          //console.log("File available at", downloadURL);
          setUrl(downloadURL);
          setUploading(false);
          setUploadProgress(0);
        });
      }
    );
  };

  const addPost = () => {
    if (selectedImage) {
      uploadImage();
    }
    if (selectedVideo) {
      uploadVideo();
    }
  };

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity onPress={addPost}>
            <Text style={styles.postBtn}>Post</Text>
          </TouchableOpacity>
        ),
      });
    }, [addPost])
  );
  return (
    <View style={styles.root}>
      {uploading == null && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}

      {uploading && (
        <Slider
          style={{
            width: "90%",
            margin: 10,
            backgroundColor: "black",
            padding: 8,
            alignSelf: "center",
            borderRadius: 5,
          }}
          minimumValue={0}
          maximumValue={100}
          value={uploadProgress}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#000000"
          thumbTintColor="#FFF"
        />
      )}

      {selectedImage && (
        <View style={styles.videoContainer}>
          <Image source={{ uri: selectedImage }} style={styles.image} />
          <TouchableOpacity
            style={styles.closeIcon}
            onPress={() => {
              setSelectedImage(null);
            }}
          >
            <Ionicons size={50} name="close-circle-outline" color="white" />
          </TouchableOpacity>
        </View>
      )}

      {selectedVideo && (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: selectedVideo }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldPlay
            isLooping
            style={styles.video}
          />
          <TouchableOpacity
            style={{ position: "absolute" }}
            onPress={() => {
              setSelectedVideo(null);
            }}
          >
            <Ionicons size={50} name="close-circle-outline" color="white" />
          </TouchableOpacity>
        </View>
      )}

      {!selectedImage && (
        <View style={styles.btnContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Ionicons name="image" size={50} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={pickVideo}>
            <Ionicons name="videocam" size={50} color="white" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={url}
          onChangeText={setUrl}
          placeholder="Download Link will be here."
          multiline={true}
          style={styles.input}
        />
      </View>
    </View>
  );
};

export default addpost;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  btnContainer: {
    backgroundColor: "black",
    padding: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    elevation: 6,
  },
  videoContainer: {
    backgroundColor: "black",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: 300,
    height: 300,
    marginTop: 20,
  },
  image: { width: 180, height: 280 },
  postBtn: { padding: 12, color: "#0ba0fa", fontSize: 18 },
  inputContainer: {
    flex: 1,
    padding: 8,
  },
  closeIcon: { position: "absolute" },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input:{
    fontSize: 18,
    margin: 8,
    textAlign: "left"
  }
});
