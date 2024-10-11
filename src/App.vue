<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getUsername } from "./services/fetch-data";
import { User } from "./models/github-api"

const users = ref<User | null>(null);
const name = ref<string>("");
const error = ref<string | null>(null);
const loading = ref<boolean>(false);
const isDarkMode = ref(false);

const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    document.documentElement.setAttribute('data-theme', isDarkMode.value ? 'dark' : 'nord');
    saveToLocal();
}

const fetchUsername = async () => {
  if (!name.value.trim()) {
    error.value = 'Username cannot be empty';
    return;
  }
  loading.value = true;
  users.value = null
  try {
    users.value = await getUsername(name.value);
    saveToLocal();
    error.value = null;
  } catch (err: any) {
    error.value = 'User not found';
    users.value= null
  }finally {
    loading.value = false;
    name.value = "";
}
}

const saveToLocal = () =>{
  if(users.value){
    localStorage.setItem("users", JSON.stringify(users.value))
  }
}
const loadFromLocal = () =>{
  const savedItems = localStorage.getItem('users')
  if(savedItems){
    users.value = JSON.parse(savedItems)
  }
}
onMounted(() =>{
  loadFromLocal();
})
</script>

<template>
  <header class="text-center mt-14">
      <h1 class="text-3xl">Find user on Github!</h1>
      <p class="mt-1">Use this app to search your username on github.</p>
  </header>
    <div class="absolute top-3 left-3">
    <label class="switch">
  <span class="sun"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g fill="#ffd43b"><circle r="5" cy="12" cx="12"></circle><path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path></g></svg></span>
  <span class="moon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path></svg></span>   
  <input @click="toggleDarkMode" type="checkbox" class="input">
  <span class="slider"></span>
</label> 
</div>
  <div class="text-center flex justify-center mt-10 flex-col items-center">
    <div class="flex max-sm:mt-12">
      <div class="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white p-5">
        <svg viewBox="0 0 20 20" aria-hidden="true" class="pointer-events-none absolute w-5 fill-gray-500 transition">
          <path d="M16.72 17.78a.75.75 0 1 0 1.06-1.06l-1.06 1.06ZM9 14.5A5.5 5.5 0 0 1 3.5 9H2a7 7 0 0 0 7 7v-1.5ZM3.5 9A5.5 5.5 0 0 1 9 3.5V2a7 7 0 0 0-7 7h1.5ZM9 3.5A5.5 5.5 0 0 1 14.5 9H16a7 7 0 0 0-7-7v1.5Zm3.89 10.45 3.83 3.83 1.06-1.06-3.83-3.83-1.06 1.06ZM14.5 9a5.48 5.48 0 0 1-1.61 3.89l1.06 1.06A6.98 6.98 0 0 0 16 9h-1.5Zm-1.61 3.89A5.48 5.48 0 0 1 9 14.5V16a6.98 6.98 0 0 0 4.95-2.05l-1.06-1.06Z"></path>
        </svg>
      </div>
      <input type="text" v-model="name" class=" bg-white pl-2 text-base font-semibold outline-0" placeholder="Search by username">
      <input @click.prevent="fetchUsername" type="button" value="Search" class="bg-blue-500 p-2 rounded-tr-lg rounded-br-lg text-white font-semibold hover:cursor-pointer hover:bg-blue-800 transition-colors">
    </div>

    <div v-if="error && !loading" class="text-red-500 mt-1 mr-2">
      <p v-if="error === 'Username cannot be empty'">{{ error }}</p>
      <p v-else-if="error === 'User not found'" class="mr-[5.7rem]">{{ error }}</p>
    </div>
  </div>
  <div>
    <div v-if="loading" class="flex justify-center mt-1 mr-36">Loading...</div>
    <div class="flex justify-center items-center">
    <div v-if="loading">
    <div class="skeleton h-[270px] w-[270px] mt-[6rem] rounded-none"></div>
    <div class="skeleton h-6 w-full mt-10 rounded-sm"></div>
    <div class="skeleton h-6 w-full mt-5 rounded-sm"></div>
  </div>
  </div>
  </div>
  <div v-if="users" class="flex justify-center items-center h-[80vh]">
    <div class="card bg-base-100 shadow-xl w-[350px] max-w-[100%]">
      <figure class="px-10 pt-10">
        <img :src="users.avatar_url" alt="User Avatar" class="rounded-sm" />
      </figure>
      <div class="card-body flex">
      <div class="flex items-center gap-3">
        <h2 class="card-title">Username:</h2>
        <p>{{ users.name || "N/A"  }} ({{users.login }})</p>
      </div>
      <div class="flex gap-3">
        <h2 class="card-title dark:text-white">Gihub:</h2>
        <a :href="users.html_url" target="_blank">
      <img 
    class="h-9 w-9 ml-9 bg-white rounded-full outline-none right-0" 
    src="https://imgs.search.brave.com/qsvY9BSl7D64qWM579-xRFPrc1Erpjiqlf3KHnBf_i0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtMDAuaWNvbmR1/Y2suY29tL2Fzc2V0/cy4wMC9naXRodWIt/aWNvbi0yNTZ4MjQ0/LTZuMDE3anJyLnBu/Zw" 
    alt="GitHub Logo" 
  />
</a>
      </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 64px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #73C0FC;
  transition: .4s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 30px;
  width: 30px;
  border-radius: 20px;
  left: 2px;
  bottom: 2px;
  z-index: 2;
  background-color: #e8e8e8;
  transition: .4s;
}

.sun svg {
  position: absolute;
  top: 6px;
  left: 36px;
  z-index: 1;
  width: 24px;
  height: 24px;
}

.moon svg {
  fill: #73C0FC;
  position: absolute;
  top: 5px;
  left: 5px;
  z-index: 1;
  width: 24px;
  height: 24px;
}

/* .switch:hover */.sun svg {
  animation: rotate 15s linear infinite;
}

@keyframes rotate {
 
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* .switch:hover */.moon svg {
  animation: tilt 5s linear infinite;
}

@keyframes tilt {
 
  0% {
    transform: rotate(0deg);
  }

  25% {
    transform: rotate(-10deg);
  }

  75% {
    transform: rotate(10deg);
  }

  100% {
    transform: rotate(0deg);
  }
}

.input:checked + .slider {
  background-color: #183153;
}

.input:focus + .slider {
  box-shadow: 0 0 1px #183153;
}

.input:checked + .slider:before {
  transform: translateX(30px);
}

</style>



