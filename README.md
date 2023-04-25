<div align="center">
  <br>
  <img alt="Native" src="assets/banner.png" width="300px">
  
  <strong>Open source & private LLM apps on your desktop.</strong>
</div>
<br>
<p align="center">
  <a href="https://github.com/matthieu-perso/native/releases">
    <img src="https://img.shields.io/github/v/release/open-sauced/open-sauced.svg?style=flat" alt="GitHub Release">
  </a>
  <a href="https://discord.gg/ZKE4X3qk">
    <img src="https://img.shields.io/discord/714698561081704529.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2" alt="Discord">
  </a>
</p>


# Overview 

LLMs and AI generally have been advancing massively since late 2022. Most notably - combining your own data with LLMs unlocks incredible use cases.

Yet this now comes at a price. 

1. The price of **privacy**. When you search your documents or ask a question, your data is sent to external servers and models - rendering its use potentially prohibitive for many use cases. 
2. The price of **control**. The data you received comes from a model and embeddings you probably haven't chosen. 

native's goal is to give both privacy and control back to users. 

We offer a UI to run LLM apps on your desktop, privately and on your terms. We run on Linux, macOs and Windows. 


# Get started 

Download the  directly from Github or from [native.site](https://native.site) and get started 🔥

## Demo 




# Features 
- Private : Your embeddings and your models stay on your computer by default. 
- Powerful : Run the latest models and LLM libraries
- Easy : A simple UI allows everyone to use the latest LLM models. 
- Free & Open : Download and run it. Nothing else. 
- Customizable : Built to be hackable. 


# Structure 

native uses tauri alongside Nextjs and Fastapi to run cross browser. 

You can run from the root of the repository. 

```shell
tauri run dev
```

To build the desktop app. 

More information [here](https://tauri.app/v1/guides/building/)

Running the UI and the server separetily is possible. 

Run the frontend from the /frontend folder:

```shell
nmp run dev
```

Run the backend from the /backend folder

```shell
python3 main.py
```


# 📖 Documentation 

Currently under construction. The project is moving fast - it will be up soon. 


# Roadmap
- [ ] Add image generation (Controlnet) task 
- [ ] Add babyAGI and autoGPT support
- [ ] Bug fixes and performance optimizations



# 🤝 Contributing 

We warmly welcome contributions to our open-source project. 

You can contribute in various ways such as adding a new feature, enhancing functionalities, or improving documentation. 

Please refer to this link for comprehensive guidelines on how to make contributions.



# Community

Got Questions or want to help ? Join the conversation in our [Discord](https://discord.gg/ZKE4X3qk).  

