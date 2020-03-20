const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  imageUpload: state=>state.upload.imageUpload,
  allowFileSize: state=>state.upload.allowFileSize,
  allowFileType: state=>state.upload.allowFileType,
}
export default getters
