import React, { useState } from 'react';
import { View, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Button, Text } from 'react-native';

const GalleryTree = () => {
  // Ruta de las imágenes en el proyecto
  const imagePaths = [
    require('../../assets/images/Arbol_de_prueba.jpg'),
    require('../../assets/images/TreeIcon.png'),
    require('../../assets/images/Arbol_de_prueba.jpg'),
    require('../../assets/images/Arbol_de_prueba.jpg'),
    require('../../assets/images/Arbol_de_prueba.jpg'),
    require('../../assets/images/TreeIcon.png'),
    require('../../assets/images/Arbol_de_prueba.jpg'),
    require('../../assets/images/Arbol_de_prueba.jpg'),
    require('../../assets/images/TreeIcon.png'),
    require('../../assets/images/Arbol_de_prueba.jpg'),
    require('../../assets/images/TreeIcon.png'),
    require('../../assets/images/Arbol_de_prueba.jpg'),
    // Añadir más imágenes si es necesario
  ];

  // Estado para manejar el índice de la imagen seleccionada y visibilidad del modal
  const [currentIndex, setCurrentIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [imagesToShow, setImagesToShow] = useState(7); // Número inicial de imágenes mostradas

  // Función para abrir el modal con la imagen seleccionada
  const openImage = (index: number) => {
    setCurrentIndex(index);
    setModalVisible(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Función para mostrar más imágenes
  const showMoreImages = () => {
    setImagesToShow(imagesToShow + 7); // Aumenta 7 imágenes más al ver más
  };

  // Renderizar cada imagen como un elemento de la galería
  const renderImage = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity onPress={() => openImage(index)}>
      <Image source={item} style={styles.imageThumbnail} />
    </TouchableOpacity>
  );

  // Renderizar el espacio de "Mostrar más"
  const renderMoreButton = () => {
    const remainingImages = imagePaths.length - imagesToShow;
    if (remainingImages > 0) {
      return (
        <TouchableOpacity style={styles.moreButtonContainer} onPress={showMoreImages}>
          <Text style={styles.moreButtonText}>+{remainingImages} más</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={imagePaths.slice(0, imagesToShow)} // Mostrar solo las imágenes que se hayan solicitado
        renderItem={renderImage}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3} // Organizar en 3 columnas
        contentContainerStyle={styles.galleryContainer}
      />

      {/* Mostrar el botón de "Mostrar más" si hay más imágenes */}
      {renderMoreButton()}

      {/* Modal para mostrar la imagen seleccionada en pantalla completa */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <Image source={imagePaths[currentIndex]} style={styles.fullImage} />
          <View style={styles.buttonContainer}>
            <Button title="Anterior" onPress={() => setCurrentIndex(currentIndex - 1)} disabled={currentIndex === 0} />
            <Button title="Cerrar" onPress={closeModal} />
            <Button title="Siguiente" onPress={() => setCurrentIndex(currentIndex + 1)} disabled={currentIndex === imagePaths.length - 1} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  galleryContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageThumbnail: {
    width: 110,
    height: 110,
    margin: 2,
    borderRadius: 2,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  moreButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    backgroundColor: '#ddd',
    borderRadius: 8,
    padding: 40,
  },
  moreButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default GalleryTree;


