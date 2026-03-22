import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addObject = async (collection_name, data) => {
  try {
    await addDoc(collection(db, collection_name), data);
    console.log("Thêm thành công!");
  } catch (e) {
    console.error("Lỗi thêm dữ liệu: ", e);
  }
};

export const getObjectById = async (collection_name, id) => {
  try {
    const docRef = doc(db, collection_name, id);   // tham chiếu đến document theo ID
    const docSnap = await getDoc(docRef);  // lấy dữ liệu

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("Không tìm thấy document!");
    }
  } catch (e) {
    console.error("Lỗi lấy dữ liệu: ", e);
  }
};

export const getObjects = async (collection_name) => {
  const querySnapshot = await getDocs(collection(db, collection_name));
  let result = [];
  querySnapshot.forEach((doc) => {
    result = [...result, doc.data()];
  });
  return result;
};

export const updateObject = async (collection_name, data, id) => {
  const userRef = doc(db, collection_name, id);
  await updateDoc(userRef, data);
  console.log("Cập nhật thành công!");
};

export const deleteObject = async (collection_name, id) => {
  await deleteDoc(doc(db, collection_name, id));
  console.log("Xóa thành công!");
};