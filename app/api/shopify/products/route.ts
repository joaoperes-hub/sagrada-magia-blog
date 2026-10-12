import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN || 'sagradamagia.com';
  const storefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN;

  if (!storefrontToken) {
    return NextResponse.json({ error: 'Shopify não configurado', products: [] }, { status: 200 });
  }

  try {
    const graphqlQuery = `
      {
        products(first: 12, query: "${query.replace(/"/g, '\\"')}") {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 1) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(`https://${shopDomain}/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken,
      },
      body: JSON.stringify({ query: graphqlQuery }),
    });

    if (!response.ok) {
      throw new Error('Shopify API error: ' + response.status);
    }

    const data = await response.json();
    const products = data.data?.products?.edges?.map((edge: any) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      price: edge.node.priceRange.minVariantPrice.amount,
      image: edge.node.images.edges[0]?.node?.url || '',
    })) || [];

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Erro Shopify:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos', products: [] }, { status: 200 });
  }
}
