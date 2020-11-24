export const operationsDoc = `
  query CandidateList($limit: Int!) {
    candidateCollection(limit: $limit) {
      items {
        sys {
          id
          publishedAt
        }
        name
        slug
        review
        mainImage {
          url
          title
          width
          height
        }
        party
      }
    }
  }
  query CandidateBySlug($slug: String!, $preview: Boolean!) {
    candidateCollection(limit: 1, where: {slug: $slug}, preview: $preview) {
        items {
          sys {
            id
            publishedAt
          }
          name
          slug
          review
          mainImage {
            url
            title
            width
            height
          }
          content{
            json
          }
          documentsCollection {
            items {
              title
              description
              fileName
              size
              url
            }
          }
          party
          facebookLink
        }
      }
    }
  }
  query MoreProjects($slug: String!, $limit: Int!) {
    projectCollection(
      where: { slug_not_in: [$slug] }
      order: sys_publishedAt_DESC
      limit: $limit
    ) {
      items {
        sys {
          id
          publishedAt
        }
        name
        slug
        review
        mainImage {
          url
          title
          width
          height
        }
        party
      }
    }
  }
  query AllCandidatesWithSlugs {
    candidateCollection(
      where: { slug_exists: true }
      order: sys_publishedAt_DESC
    ) {
      items {
        slug
      }
    }
  }
  query AllParties{
    candidateCollection(where: {party_exists: true}) {
      items {
        party
      }
    }
  }
`;
