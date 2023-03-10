import { serve } from "https://deno.land/std@0.178.0/http/server.ts"
import { extname } from "https://deno.land/std@0.178.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.178.0/media_types/mod.ts";

import type { Handler } from "https://deno.land/std@0.178.0/http/server.ts"

type GET_Route = (req: Request, filename: string) => Response | Promise<Response>
type POST_Route = (req: Request) => Response | Promise<Response>
type POST_Route_Handler = (body: Record<string, string>) => Response

let participants: string[] = []

const getParticipants: POST_Route_Handler = function (body) {
    return new Response(JSON.stringify(participants), {status: 200})
}

const addParticipant: POST_Route_Handler = function (body) {
    participants.push(body.name)
    return new Response(null, {status: 200})
}

const deleteParticipants: POST_Route_Handler = function(body) {
    participants = []
    return new Response(null,{status: 200})
}

const deleteParticipant: POST_Route_Handler = function(body) {
    console.log(body.name)
    participants.splice(participants.indexOf(body.name))
    console.log(participants)
    return new Response(null,{status: 200})
}

const GET_home: GET_Route = async function (req, filename) {
    const file = await Deno.open(filename)
    const headers = new Headers({
        'content-type': contentType(extname(filename)) as string
    })
    return new Response(file.readable, {status: 200, headers})
}

const POST_home: POST_Route = async function (req) {
    const body = await req.json()
    if (body.function === "getParticipants") {
        return getParticipants(body)}
    else if (body.function === "addParticipant") {
        return addParticipant(body)}
    else if (body.function === "deleteParticipants") {
        return deleteParticipants(body)}
    else if (body.function === "deleteParticipant") {
        return deleteParticipant(body)}
    else return new Response(null)
}

const GET_routes: Record<string, GET_Route> = {
    '/': GET_home
}

const POST_routes: Record<string, POST_Route> = {
    '/': POST_home
}

const handler: Handler = function (req) {
    let path = new URL(req.url).pathname.substring(1)
    if (req.method === "GET") {
        const filename = extname(path) ? path : "./index.html"
        path = "/"
        return GET_routes["/"](req, filename)} 
    else if (req.method === "POST") {
        return POST_routes["/"](req)} 
    else {
        return new Response(null)}
}

serve(handler)