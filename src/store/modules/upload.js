
const state= {

    imageUpload: 0,
    allowFileType:['image/jpeg','image/png'],
    allowFileSize: 1024*1024*2,
}


const mutations = {

    open(state){
        state.imageUpload += 1;
    },

    close(state){
        state.imageUpload = 0;
    },

    setAllowFileSize(state,size){
        allowFileSize = size;
    }
}

const actions = {

    open(context){

        context.commit('open');
    },

    close(context){

      context.commit('close');
    },

    setAllowFileSize(context,size){
        context.commit('setAllowFileSize',size);
    }
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
  }

