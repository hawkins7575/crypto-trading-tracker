import { convexAuth } from "@convex-dev/auth/server";
import GitHub from "@auth/core/providers/github";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// 환경변수 확인 및 기본값 설정
const githubClientId = process.env.AUTH_GITHUB_ID || "Ov23lirGHK12u75YPUSb";
const githubClientSecret = process.env.AUTH_GITHUB_SECRET || "c063cefe276c8dfdc2d97d0853c164922c103c32";

console.log("Auth environment check:");
console.log("- GitHub Client ID:", githubClientId ? "✓ Present" : "✗ Missing");
console.log("- GitHub Client Secret:", githubClientSecret ? "✓ Present" : "✗ Missing");

// 안전한 GitHub provider 구성
const createGitHubProvider = () => {
  try {
    if (!githubClientId || !githubClientSecret) {
      console.error("Missing GitHub OAuth credentials");
      return null;
    }
    
    const provider = GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
    });
    
    console.log("GitHub provider created successfully");
    return provider;
  } catch (error) {
    console.error("Failed to create GitHub provider:", error);
    return null;
  }
};

const githubProvider = createGitHubProvider();

// Convex Auth 설정
export const { auth, signIn, signOut, store } = convexAuth({
  providers: githubProvider ? [githubProvider] : [],
});

// 현재 사용자 정보 조회
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;
    
    const user = await ctx.db.get(userId);
    return user;
  },
});