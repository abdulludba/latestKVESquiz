import { firebaseConfig } from './firebaseConfig.js'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getDatabase, set, ref, push, update, onValue, child, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";



const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app)
export const auth = getAuth(app)
const p = console.log


export const signOutAcc = (loading) => {
  loading.style.display = 'flex'
  signOut(auth).then(() => {
    window.location.href = 'index.html'
    loading.style.display = 'none'
    alert('signed out successfully')
    // Sign-out successful.
  }).catch((error) => {
    // An error happened.
  });
}


export const signInAcc = (email, password,loading) => {
  loading.style.display = 'flex'
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      const uid = user.uid
  loading.style.display = 'none'

      window.location.href = `../index.html?uid=${uid}`

    })
    .catch((error) => {
      alert(error.message)
      const errorCode = error.code;
      const errorMessage = error.message;
      
    });
}


export const createAcc = (email, password, username, loading) => {
  loading.style.display = 'flex'
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      loading.style.display = 'none'
      // Signed in 
      const user = userCredential.user;
      const uid = user.uid

    })
    .catch((error) => {
      alert(error.message)
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
    });
}

export const storeUsername = (username, loading) => {
  loading.style.display = 'flex'
  onAuthStateChanged(auth, (user) => {

    if (user) {
      const uid = user.uid;
      const usernameRef = ref(getDatabase(), `TeacherList/${uid}/username`)
      set(usernameRef, username).then(() => {
          alert('usernsme stored in Firebase RTDB successfully');
        })
        .catch((error) => {
          alert('Error storing class names in Firebase RTDB:', error);
        });
      loading.style.display = 'none'
    } else {
      // User is signed out
      // ...
    }
  });
}


export const storeTeacherClasses = (classes, loading) => {
  loading.style.display = 'flex'
  onAuthStateChanged(auth, (user) => {
    if (user) {

      const uid = user.uid;
      const classRef = ref(db, `TeacherList/${uid}/Classes`)


      set(classRef, classes).then(() => {
          alert('Class names stored in Firebase RTDB successfully');
          
          window.location.href = `../index.html?uid=${uid}`
        })
        .catch((error) => {
          alert('Error storing class names in Firebase RTDB:', error);
        });
      loading.style.display = 'none'

    } else {
      // User is signed out
      // ...
    }
  })
}


export function isUserSignedIn(loading) {
  loading.style.display = 'flex'
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      loading.style.display = 'none'
      if (user) {
        // User is signed in
        resolve({ uid: user.uid, signedIn: true });
      } else {
        // No user signed in
        resolve({ uid: null, signedIn: false });
      }
    });
  });
}


export const storeSecToLeaderboard = (sec, loading) => {
    loading.style.display = 'flex'
    let secKeys = Object.keys(sec)
    const leaderboardRef = ref(db, 'Leaderboard/section');
    let objKey, objValue
    const sectList = {}
    onValue(leaderboardRef, (snapshot) => {
      if(snapshot.exists()){
        let secValue = Object.values(snapshot.val())
        let secLength = secValue.length
        for(let i =0; i<= secKeys.length-1; i++){
          if(secValue.includes(secKeys[i])){
            p(secKeys[i])
          }else{
             objKey = `${i}`
             objValue = `${secKeys[i]}`
          }
          sectList[objKey] = objValue
        }
        update(leaderboardRef,sectList)
        
        
      }else{
        set(leaderboardRef, Object.keys(sec))
      }
    })

loading.style.display = 'none'
}


export const storeQuizDataOnDb= (quizData,uid,loading,subject) => {
    loading.style.display = 'flex'

    const quizListRef = ref(db, `QuizList/${uid}/${subject}`)

    push(quizListRef, quizData).then(() => {
          alert('quizzes stored in db')
          
         window.location.href = `Dashboard.html?uid=${result.uid}`
        })
        .catch((error) => {
          alert('Error storing quizzes in Firebase RTDB:', error);
        });
    loading.style.display = 'none'
window.location.href = `Dashboard.html?uid=${uid}`

}