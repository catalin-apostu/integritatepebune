import { GraphQLClient } from 'graphql-request'
import { operationsDoc, ticksDoc, aniDoc, aniByPartyDoc, reportsDoc, legalDoc } from 'lib/queries'

const space = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const publicToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
const previewToken = process.env.NEXT_PUBLIC_CONTENTFUL_PREVIEW_ACCESS_TOKEN
export const swrFetcher = async (query: string) => {
  const endpoint = `https://graphql.contentful.com/content/v1/spaces/${space}`

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${publicToken}`,
    },
  })
  return await graphQLClient.request(query)
}
export const candidatesFetcher = async (query: string) => {
  const data = await swrFetcher(query)
  return await data.candidateCollection.items
}

export async function fetchGraphQL(
  query: string,
  operationName: string,
  variables?: { [key: string]: string | number | boolean },
  preview?: boolean
) {
  const result = await fetch(`https://graphql.contentful.com/content/v1/spaces/${space}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${preview ? previewToken : publicToken}`,
    },
    body: JSON.stringify({
      query: query,
      variables: variables,
      operationName: operationName,
    }),
  })
  const json = await result.json()

  if (!!json.errors) {
    console.warn(
      `Errors in GraphQL query ${operationName}:`,
      json.errors.map((m: any) => m.message)
    )
  }

  return json
}
export function extractCounty(fetchResponse: { data: any }) {
  return fetchResponse?.data?.county?.items?.[0] || null
}
export function extractCandidate(fetchResponse: { data: any }) {
  return fetchResponse?.data?.candidateCollection?.items?.[0] || null
}
export function extractCandidateEntries(fetchResponse: { data: any }) {
  return fetchResponse?.data?.candidateCollection?.items || []
}
export function extractTick(fetchResponse: { data: any }) {
  return fetchResponse?.data?.tickCollection?.items?.[0] || null
}
export function extractAni(fetchResponse: { data: any }) {
  return fetchResponse?.data?.aniPeBuneCollection?.items?.[0] || null
}
export function extractTickEntries(fetchResponse: { data: any }) {
  return fetchResponse?.data?.tickCollection?.items || []
}
export function extractAniEntries(fetchResponse: { data: any }) {
  return fetchResponse?.data?.aniPeBuneCollection?.items || []
}
export async function getTicks(limit: number, preview: boolean) {
  const entries = await fetchGraphQL(ticksDoc, 'TicksList', { limit }, preview)
  return extractTickEntries(entries)
}
export async function getAnis(limit: number, preview: boolean) {
  const entries = await fetchGraphQL(aniDoc, 'AniList', { limit }, preview)
  return extractAniEntries(entries)
}
export async function getTickBySlug(slug: string, limit: number, preview: boolean) {
  const entry = await fetchGraphQL(ticksDoc, 'TickBySlug', { slug, preview }, preview)
  const entries = await fetchGraphQL(ticksDoc, 'MoreTicks', { slug, limit }, preview)
  return {
    tick: extractTick(entry),
    moreTicks: extractTickEntries(entries),
  }
}
export async function getAniBySlug(slug: string, limit: number, preview: boolean) {
  const entry = await fetchGraphQL(aniDoc, 'AniBySlug', { slug, preview }, preview)
  const entries = await fetchGraphQL(aniDoc, 'MoreAni', { slug, limit }, preview)
  return {
    ani: extractAni(entry),
    moreAnis: extractAniEntries(entries),
  }
}
export async function getAllTicksWithSlugs() {
  const entries = await fetchGraphQL(ticksDoc, 'AllTicksWithSlugs')
  return extractTickEntries(entries)
}
export async function getAllAniWithSlugs() {
  const entries = await fetchGraphQL(aniDoc, 'AllAniWithSlugs')
  return extractAniEntries(entries)
}
export async function getPage(slug: string, preview: boolean) {
  const { data } = await fetchGraphQL(operationsDoc, 'PageQuery', { slug }, preview)

  return data?.page.items[0]
}
export async function getCandidates(limit: number, preview: boolean) {
  const entries = await fetchGraphQL(operationsDoc, 'CandidateList', { limit }, preview)
  return extractCandidateEntries(entries)
}
export async function getCandidatesByCounty(countyCode: string | null) {
  const entries = await fetchGraphQL(operationsDoc, 'CandidatesByCounty', {
    county: countyCode || '',
  })
  return extractCandidateEntries(entries)
}
export async function getCandidatesByParty(party: string, limit: number, preview: boolean) {
  const entries = await fetchGraphQL(operationsDoc, 'CandidatesByParty', { party, limit, preview }, preview)
  return extractCandidateEntries(entries)
}
export async function getCandidatesTotalByParty(party: string) {
  const { data } = await fetchGraphQL(operationsDoc, 'CandidatesTotalByParty', {
    party,
  })

  return data?.candidateCollection?.total || 0
}
export async function getCandidateBySlug(slug: string, limit: number, preview: boolean) {
  const entry = await fetchGraphQL(operationsDoc, 'CandidateBySlug', { slug, preview }, preview)
  const entries = await fetchGraphQL(operationsDoc, 'MoreCandidates', { slug, limit }, preview)
  return {
    candidate: extractCandidate(entry),
    moreCandidates: extractCandidateEntries(entries),
  }
}
export async function getAllCandidatesWithSlugs() {
  const entries = await fetchGraphQL(operationsDoc, 'AllCandidatesWithSlugs')
  return extractCandidateEntries(entries)
}
export async function getPreviewProjectBySlug(slug: string) {
  const entry = await fetchGraphQL(
    operationsDoc,
    'CandidateBySlug',
    {
      slug,
    },
    true
  )
  return extractCandidate(entry)
}
export async function getCountyById(id: string) {
  const entry = await fetchGraphQL(operationsDoc, 'County', { id }, true)
  return extractCounty(entry)
}
export async function getAniByParty(party: string, limit: number, preview: boolean) {
  const entries = await fetchGraphQL(aniByPartyDoc, 'AniByParty', { party, limit, preview }, preview)
  return extractAniEntries(entries)
}
export async function getAniTotalByParty(party: string) {
  const { data } = await fetchGraphQL(aniByPartyDoc, 'AniTotalByParty', { party })
  return data?.aniPeBuneCollection?.total || 0
}
export async function getReports() {
  const entries = await fetchGraphQL(reportsDoc, 'Reports')
  return extractReports(entries)
}
export function extractReports(fetchResponse: { data: any }) {
  return fetchResponse?.data?.reportCollection?.items || []
}
export async function getReportDocuments() {
  const entries = await fetchGraphQL(reportsDoc, 'ReportDocuments')
  return extractReportDocuments(entries)
}
export function extractReportDocuments(fetchResponse: { data: any }) {
  return fetchResponse?.data?.reportDocumentCollection?.items || []
}
export async function getLegalBySlug(slug: string) {
  const entry = await fetchGraphQL(legalDoc, 'LegalBySlug', { slug })
  return extractLegal(entry)
}
export function extractLegal(fetchResponse: { data: any }) {
  return fetchResponse?.data?.legalCollection?.items?.[0] || null
}
export async function getAllLegalsWithSlugs() {
  const entries = await fetchGraphQL(legalDoc, 'AllLegalsWithSlugs')
  return extractLegalEntries(entries)
}
export function extractLegalEntries(fetchResponse: { data: any }) {
  return fetchResponse?.data?.legalCollection?.items || []
}
