import { collection, addDoc, getDocs } from "firebase/firestore";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

const addObject = async (collection, data) => {
  try {
    await addDoc(collection(db, collection), data);
    console.log("Thêm thành công!");
  } catch (e) {
    console.error("Lỗi thêm dữ liệu: ", e);
  }
};

const getObjectById = async (collection, id) => {
  try {
    const docRef = doc(db, collection, id);   // tham chiếu đến document theo ID
    const docSnap = await getDoc(docRef);  // lấy dữ liệu

    if (docSnap.exists()) {
      console.log("Dữ liệu:", docSnap.data());
    } else {
      console.log("Không tìm thấy document!");
    }
  } catch (e) {
    console.error("Lỗi lấy dữ liệu: ", e);
  }
};

const getObject = async (collection) => {
  const querySnapshot = await getDocs(collection(db, collection));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} =>`, doc.data());
  });
};

const updateObject = async (collection, data, id) => {
  const userRef = doc(db, collection, id);
  await updateDoc(userRef, data);
  console.log("Cập nhật thành công!");
};

const deleteObject = async (collection, id) => {
  await deleteDoc(doc(db, collection, id));
  console.log("Xóa thành công!");
};