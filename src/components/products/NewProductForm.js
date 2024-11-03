import React, { useState, useEffect } from 'react';
import styles from './NewProductForm.module.css';

const NewProductForm = ({ onClose, isEdit = false, existingProduct = null }) => {
  const [formData, setFormData] = useState({
    code: '',
    productName: '',
    description: '',
    manufacturer: '',
    price: '',
    category: '',
    measureUnit: '',
    dimensionsId: ''
  });
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(''); // For displaying existing image URL in edit mode
  const [dimensions, setDimensions] = useState([]);
  const [newDimension, setNewDimension] = useState({ length: '', width: '', height: '' });
  const [showNewDimensionFields, setShowNewDimensionFields] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch dimensions on load
  const fetchDimensions = async () => {
    try {
      const response = await fetch('https://localhost:7046/api/Dimensions');
      const data = await response.json();
      const formattedDimensions = data.map(dim => ({
        id: dim.id,
        label: `${dim.width} x ${dim.length} x ${dim.height}`
      }));
      setDimensions(formattedDimensions);
    } catch (error) {
      console.error('Error fetching dimensions:', error);
    }
  };

  useEffect(() => {
    fetchDimensions();

    // If editing, load the existing product data into form
    if (isEdit && existingProduct) {
      setFormData({
        code: existingProduct.code || '',
        productName: existingProduct.name || '',
        description: existingProduct.description || '',
        manufacturer: existingProduct.manufacturer || '',
        price: existingProduct.price || '',
        category: existingProduct.category !== undefined ? parseInt(existingProduct.category) : '',
        measureUnit: existingProduct.unit !== undefined ? parseInt(existingProduct.unit) : '',
        dimensionsId: existingProduct.dimensionsId || ''
      });

      // Set the initial image URL if available
      if (existingProduct.image) {
        setImageUrl(existingProduct.image);
      }
    }
  }, [isEdit, existingProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setImageUrl(''); // Clear existing image URL when a new file is selected
  };

  const handleNewDimensionChange = (e) => {
    const { name, value } = e.target;
    setNewDimension((prev) => ({ ...prev, [name]: value }));
  };

  const uploadImageToAzure = async (file) => {
    try {
      const storageAccountUrl = "https://lumbershop.blob.core.windows.net";
      const containerName = "images";
      const sasToken = "sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-11-03T19:33:17Z&st=2024-11-03T11:33:17Z&spr=https,http&sig=PNejFhRgxodvK0fAseCnNxa%2F73UCHGz4HmZYU%2FEEdGc%3D";
      
      const blobUrl = `${storageAccountUrl}/${containerName}/${file.name}?${sasToken}`;

      const response = await fetch(blobUrl, {
        method: 'PUT',
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': file.type
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error(`Image upload failed with status: ${response.status}`);
      }

      return `${storageAccountUrl}/${containerName}/${file.name}`;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const addNewDimension = async () => {
    try {
      const response = await fetch('https://localhost:7046/api/Dimensions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newDimension),
      });

      if (!response.ok) throw new Error('Failed to add new dimension');

      const newDim = await response.json();

      setNewDimension({ length: '', width: '', height: '' });
      setShowNewDimensionFields(false);

      fetchDimensions();

      setFormData((prev) => ({ ...prev, dimensionsId: newDim.id }));
    } catch (error) {
      console.error('Error adding new dimension:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrlToUse = imageUrl;
    if (image) {
      imageUrlToUse = await uploadImageToAzure(image);
      if (!imageUrlToUse) {
        alert('Image upload failed');
        return;
      }
    }

    const payload = {
      id: formData.code,
      name: formData.productName,
      description: formData.description,
      category: parseInt(formData.category),
      manufacturer: formData.manufacturer,
      unit: parseInt(formData.measureUnit),
      price: parseFloat(formData.price),
      dimensionsId: parseInt(formData.dimensionsId),
      image: imageUrlToUse
    };

    if (isEdit) {
      updateProductData(payload);
    } else {
      sendProductData(payload);
    }
  };

  const sendProductData = async (payload) => {
    try {
      const response = await fetch('https://localhost:7046/api/Product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to add product');

      alert('Product added successfully');
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product');
    }
  };

  const updateProductData = async (payload) => {
    try {
      const response = await fetch(`https://localhost:7046/api/Product/${formData.code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to update product');

      alert('Product updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2>{isEdit ? 'Izmeni proizvod' : 'Novi proizvod'}</h2>
        <div className={styles.scrollableContent}>
          <form onSubmit={handleSubmit}>
            
            <div className={styles.formGroup}>
                <label>Fotografija:</label>
                <div className={styles.imageUploadContainer}>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                        {isEdit && imageUrl && <img src={imageUrl} alt="Current Product" className={styles.tinyImage} />}
                </div>
            </div>

            {!isEdit && (
              <label>Sifra proizvoda:
                <input type="text" name="code" value={formData.code} onChange={handleInputChange} required />
              </label>
            )}

            <label>Naziv proizvoda:
              <input type="text" name="productName" value={formData.productName} onChange={handleInputChange} required />
            </label>

            <label>Proizvodjac:
              <input type="text" name="manufacturer" value={formData.manufacturer} onChange={handleInputChange} required />
            </label>

            <label>Cena po jedinici mere (RSD):
              <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
            </label>

            <label>Kategorija:
              <select name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">Odaberi kategoriju</option>
                <option value="0">Plocasti materijal</option>
                <option value="1">Drvo</option>
              </select>
            </label>

            <label>Jedinica mere:
              <select name="measureUnit" value={formData.measureUnit} onChange={handleInputChange} required>
                <option value="">Odaberi jedinicu mere</option>
                <option value="0">kom</option>
                <option value="1">m²</option>
                <option value="2">m³</option>
              </select>
            </label>

            <label>Dimenzije:
              <select name="dimensionsId" value={formData.dimensionsId} onChange={handleInputChange} required>
                <option value="">Odaberi dimenzije</option>
                {dimensions.map(dim => (
                  <option key={dim.id} value={dim.id}>{dim.label}</option>
                ))}
              </select>
              <button type="button" onClick={() => setShowNewDimensionFields(!showNewDimensionFields)}>
                {showNewDimensionFields ? 'Ponisti' : 'Dodaj nove dimenzije'}
              </button>
            </label>

            {showNewDimensionFields && (
              <div className={styles.newDimensionFields}>
                <input type="number" name="length" placeholder="Duzina" value={newDimension.length} onChange={handleNewDimensionChange} className={styles.dimensionInput} />
                <input type="number" name="width" placeholder="Sirina" value={newDimension.width} onChange={handleNewDimensionChange} className={styles.dimensionInput} />
                <input type="number" name="height" placeholder="Visina" value={newDimension.height} onChange={handleNewDimensionChange} className={styles.dimensionInput} />
                <button type="button" onClick={addNewDimension} className={styles.addDimensionButton}>Dodaj</button>
              </div>
            )}

            <button type="submit" className={styles.submitButton}>{isEdit ? 'Izmeni proizvod' : 'Dodaj proizvod'}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewProductForm;
