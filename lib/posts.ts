import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from'rehype-highlight';
import rehypeSlug from'rehype-slug';
import Video from "@/app/components/Video"
import CustomImage from "@/app/components/CustomImage"


type Filetree = {
    "tree": [
        {
            "path": string,
        }
    ]
}

export async function getPostByName(fileName: string):Promise <BlogPost|undefined>{
    const res = await fetch(`https://raw.githubusercontent.com/huangjulu/test-blogposts/main/${fileName}`,{
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        }
    })
    if(!res.ok) return undefined

    const rawMDX = await res.text()
    if(rawMDX === '404: Not Found') return undefined

    const { frontmatter, content } = await compileMDX <{ 
        title: string,
        date: string,
        tags: string[]
     }>({
        source: rawMDX,
        components:{
          Video,
          CustomImage,
        },
        options:{
            parseFrontmatter: true,
            mdxOptions: {
              rehypePlugins: [
                rehypeHighlight,
                rehypeSlug,
                [rehypeAutolinkHeadings, {
                    behavior: 'wrap'
                }],
              ],
            }
            // ex.
            //---
            // title: 我的文章
            // date: 2024-07-05
            // tags: [web, development]
            // ---
            // 如果是 true, 則會檢查並處理標題區塊(ex. title, date...)；false 的話則視為普通文本

        }
     })

     const id = fileName.replace(/\.mdx$/, '')
     const blogPostObj: BlogPost = {
        meta:{
            id,
            title: frontmatter.title,
            date: frontmatter.date,
            tags: frontmatter.tags,
        }, 
        content
     }
     return blogPostObj
}

export async function getPostMeta():Promise<Meta[] | undefined> {
  try{
    const res = await fetch('https://api.github.com/repos/huangjulu/test-blogposts/git/trees/main?recursive=1',{
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'X-GitHub-Api-Version': '2022-11-28',
      }
    })  
    
    if(!res.ok) {
      console.error(`GitHub API responded with status ${res.status}`)
      console.error(await res.text())
      return undefined
    }
    const repoFiletree: Filetree = await res.json()
    const filesArray = repoFiletree.tree.map(obj => obj.path).filter(path => path.endsWith('.mdx'))
    const posts: Meta[] = []

    for(const file of filesArray) {
      const post = await getPostByName(file)
      if(post) {
          const { meta } = post
          posts.push(meta)
      }
    }
    return posts.sort((a, b) => a.date < b.date? 1 : -1)
  }
  catch(err){
    console.log('Error in getPostMeta:', err)
    return undefined
  }
}

// GitToken = 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
