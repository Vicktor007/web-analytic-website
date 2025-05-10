import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";





export async function OPTIONS(){

    const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

    return NextResponse.json({}, {headers: corsHeaders});
  }

  export async function POST(request: NextRequest){

    const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

    const response = await request.json();
    const {domain, url, event, source} = response;

    if(!url.includes(domain)){
        return NextResponse.json(
            {
                error: 
                "the script points to a different domain than the current url. make sure they match",
            }, {headers: corsHeaders});

            
    }

    if(event == "session_start"){
        await db.website_visits.create({
            data: {
                domain: domain,
                source: source ?? "Direct"
            }
        })
    }

    if(event == "pageview"){
        await db.website_page_views.create({
            data: {
                domain: domain,
                page_visited: url
            }
        })
    }

    return NextResponse.json({response}, {headers: corsHeaders});
  }