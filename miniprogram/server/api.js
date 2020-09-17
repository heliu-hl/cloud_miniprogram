import { request } from "./server.js"
import { config } from "./config.js"
const method = "POST";

const urls = {
  questionUrl:"iqa/query",
  getDepartmentRanking: "dormitoryAPI/getDepartmentRanking",
}
export function question(data){
  let url = config.base_url+urls.questionUrl;
  return request({ url ,data})
}

export function getInfo(data) {
  let url = config.base_url;
  return request({ url ,data})
}
