
const state= {

    imageUpload: 0

}


const mutations = {

    open(state){

        state.imageUpload += 1;
    },

    close(state){
        state.imageUpload = 0;
    }
}

const actions = {

    open(context){

        context.commit('open');
    },

    close(context){

      context.commit('close');
    }

}


export default {
    namespaced: true,
    state,
    mutations,
    actions
  }

