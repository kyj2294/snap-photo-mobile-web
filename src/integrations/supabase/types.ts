export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bigObject: {
        Row: {
          amount: number | null
          ggyuk: string | null
          gubn: string | null
          objName: string | null
        }
        Insert: {
          amount?: number | null
          ggyuk?: string | null
          gubn?: string | null
          objName?: string | null
        }
        Update: {
          amount?: number | null
          ggyuk?: string | null
          gubn?: string | null
          objName?: string | null
        }
        Relationships: []
      }
      korean_regions: {
        Row: {
          area: number | null
          id: number
          name: string
          type: string
        }
        Insert: {
          area?: number | null
          id?: number
          name: string
          type: string
        }
        Update: {
          area?: number | null
          id?: number
          name?: string
          type?: string
        }
        Relationships: []
      }
      minwon_voice: {
        Row: {
          id: number
          "PDF 파일": string | null
          공개여부: string | null
          내용: string | null
          이름: string | null
          이메일: string | null
          전화번호: string | null
          제목: string | null
        }
        Insert: {
          id?: number
          "PDF 파일"?: string | null
          공개여부?: string | null
          내용?: string | null
          이름?: string | null
          이메일?: string | null
          전화번호?: string | null
          제목?: string | null
        }
        Update: {
          id?: number
          "PDF 파일"?: string | null
          공개여부?: string | null
          내용?: string | null
          이름?: string | null
          이메일?: string | null
          전화번호?: string | null
          제목?: string | null
        }
        Relationships: []
      }
      population_stats: {
        Row: {
          age_20_to_40: number | null
          age_40_to_60: number | null
          female_population: number | null
          id: number
          male_population: number | null
          over_60: number | null
          population_density: number | null
          region_id: number
          total_population: number
          under_20: number | null
          year: number
        }
        Insert: {
          age_20_to_40?: number | null
          age_40_to_60?: number | null
          female_population?: number | null
          id?: number
          male_population?: number | null
          over_60?: number | null
          population_density?: number | null
          region_id: number
          total_population: number
          under_20?: number | null
          year: number
        }
        Update: {
          age_20_to_40?: number | null
          age_40_to_60?: number | null
          female_population?: number | null
          id?: number
          male_population?: number | null
          over_60?: number | null
          population_density?: number | null
          region_id?: number
          total_population?: number
          under_20?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "population_stats_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "korean_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      QuestLaw: {
        Row: {
          answer_cn: string | null
          id: number
          point: number | null
          quest_cn: string | null
          quest_dt: string
          quest_userid: string | null
        }
        Insert: {
          answer_cn?: string | null
          id?: number
          point?: number | null
          quest_cn?: string | null
          quest_dt?: string
          quest_userid?: string | null
        }
        Update: {
          answer_cn?: string | null
          id?: number
          point?: number | null
          quest_cn?: string | null
          quest_dt?: string
          quest_userid?: string | null
        }
        Relationships: []
      }
      QuestUser: {
        Row: {
          admin_yn: boolean | null
          created_at: string
          last_login_dtm: string | null
          use_yn: boolean | null
          user_id: string
          user_pass: string | null
        }
        Insert: {
          admin_yn?: boolean | null
          created_at?: string
          last_login_dtm?: string | null
          use_yn?: boolean | null
          user_id: string
          user_pass?: string | null
        }
        Update: {
          admin_yn?: boolean | null
          created_at?: string
          last_login_dtm?: string | null
          use_yn?: boolean | null
          user_id?: string
          user_pass?: string | null
        }
        Relationships: []
      }
      QusetKey: {
        Row: {
          llm_api_key_vl: string | null
          LLM_cd: string
          regsiter_dt: string
          seq: number
          Use_yn: boolean | null
        }
        Insert: {
          llm_api_key_vl?: string | null
          LLM_cd: string
          regsiter_dt: string
          seq?: number
          Use_yn?: boolean | null
        }
        Update: {
          llm_api_key_vl?: string | null
          LLM_cd?: string
          regsiter_dt?: string
          seq?: number
          Use_yn?: boolean | null
        }
        Relationships: []
      }
      renewableCenter: {
        Row: {
          bscTelnoCn: string | null
          clctItemCn: string | null
          comRelSrwrdListCn: string | null
          dyoffBgndeCn: string | null
          dyoffEnddtCn: string | null
          dyoffRsnExpln: string | null
          etcMttrCn: string | null
          friSalsHrExplnCn: string | null
          indivRelSrchListCn: string | null
          indivTelnoCn: string | null
          lhldyDyoffCn: string | null
          lhldySalsHrExplnCn: string | null
          lnkgHmpgUrlAddr: string | null
          monSalsHrExplnCn: string | null
          objID: string | null
          point: number | null
          positnCnvncFcltSrvcExpln: string | null
          positnIntdcCn: string | null
          positnLotnoAddr: string | null
          positnNm: string | null
          positnPstnAddExpln: string | null
          positnPstnLat: number | null
          positnPstnLot: number | null
          positnRdnmAddr: string | null
          positnRgnNm: string | null
          prkMthdExpln: string | null
          rprsTelnoCn: string | null
          satSalsHrExplnCn: string | null
          sunSalsHrExplnCn: string | null
          telnoExpln: string | null
          thurSalsHrExplnCn: string | null
          tmprLhldyCn: string | null
          tuesSalsHrExplnCn: string | null
          wedSalsHrExplnCn: string | null
        }
        Insert: {
          bscTelnoCn?: string | null
          clctItemCn?: string | null
          comRelSrwrdListCn?: string | null
          dyoffBgndeCn?: string | null
          dyoffEnddtCn?: string | null
          dyoffRsnExpln?: string | null
          etcMttrCn?: string | null
          friSalsHrExplnCn?: string | null
          indivRelSrchListCn?: string | null
          indivTelnoCn?: string | null
          lhldyDyoffCn?: string | null
          lhldySalsHrExplnCn?: string | null
          lnkgHmpgUrlAddr?: string | null
          monSalsHrExplnCn?: string | null
          objID?: string | null
          point?: number | null
          positnCnvncFcltSrvcExpln?: string | null
          positnIntdcCn?: string | null
          positnLotnoAddr?: string | null
          positnNm?: string | null
          positnPstnAddExpln?: string | null
          positnPstnLat?: number | null
          positnPstnLot?: number | null
          positnRdnmAddr?: string | null
          positnRgnNm?: string | null
          prkMthdExpln?: string | null
          rprsTelnoCn?: string | null
          satSalsHrExplnCn?: string | null
          sunSalsHrExplnCn?: string | null
          telnoExpln?: string | null
          thurSalsHrExplnCn?: string | null
          tmprLhldyCn?: string | null
          tuesSalsHrExplnCn?: string | null
          wedSalsHrExplnCn?: string | null
        }
        Update: {
          bscTelnoCn?: string | null
          clctItemCn?: string | null
          comRelSrwrdListCn?: string | null
          dyoffBgndeCn?: string | null
          dyoffEnddtCn?: string | null
          dyoffRsnExpln?: string | null
          etcMttrCn?: string | null
          friSalsHrExplnCn?: string | null
          indivRelSrchListCn?: string | null
          indivTelnoCn?: string | null
          lhldyDyoffCn?: string | null
          lhldySalsHrExplnCn?: string | null
          lnkgHmpgUrlAddr?: string | null
          monSalsHrExplnCn?: string | null
          objID?: string | null
          point?: number | null
          positnCnvncFcltSrvcExpln?: string | null
          positnIntdcCn?: string | null
          positnLotnoAddr?: string | null
          positnNm?: string | null
          positnPstnAddExpln?: string | null
          positnPstnLat?: number | null
          positnPstnLot?: number | null
          positnRdnmAddr?: string | null
          positnRgnNm?: string | null
          prkMthdExpln?: string | null
          rprsTelnoCn?: string | null
          satSalsHrExplnCn?: string | null
          sunSalsHrExplnCn?: string | null
          telnoExpln?: string | null
          thurSalsHrExplnCn?: string | null
          tmprLhldyCn?: string | null
          tuesSalsHrExplnCn?: string | null
          wedSalsHrExplnCn?: string | null
        }
        Relationships: []
      }
      renewalcenter: {
        Row: {
          bscTelnoCn: string | null
          clctItemCn: string | null
          comRelSrwrdListCn: string | null
          dyoffBgndeCn: string | null
          dyoffEnddtCn: string | null
          dyoffRsnExpln: string | null
          etcMttrCn: string | null
          friSalsHrExplnCn: string | null
          indivRelSrchListCn: string | null
          indivTelnoCn: string | null
          lhldyDyoffCn: string | null
          lhldySalsHrExplnCn: string | null
          lnkgHmpgUrlAddr: string | null
          monSalsHrExplnCn: string | null
          objID: string | null
          point: number | null
          positnCnvncFcltSrvcExpln: string | null
          positnIntdcCn: string | null
          positnLotnoAddr: string | null
          positnNm: string | null
          positnPstnAddExpln: string | null
          positnPstnLat: number | null
          positnPstnLot: number | null
          positnRdnmAddr: string | null
          positnRgnNm: string | null
          prkMthdExpln: string | null
          rprsTelnoCn: string | null
          satSalsHrExplnCn: string | null
          sunSalsHrExplnCn: string | null
          telnoExpln: string | null
          thurSalsHrExplnCn: string | null
          tmprLhldyCn: string | null
          tuesSalsHrExplnCn: string | null
          wedSalsHrExplnCn: string | null
        }
        Insert: {
          bscTelnoCn?: string | null
          clctItemCn?: string | null
          comRelSrwrdListCn?: string | null
          dyoffBgndeCn?: string | null
          dyoffEnddtCn?: string | null
          dyoffRsnExpln?: string | null
          etcMttrCn?: string | null
          friSalsHrExplnCn?: string | null
          indivRelSrchListCn?: string | null
          indivTelnoCn?: string | null
          lhldyDyoffCn?: string | null
          lhldySalsHrExplnCn?: string | null
          lnkgHmpgUrlAddr?: string | null
          monSalsHrExplnCn?: string | null
          objID?: string | null
          point?: number | null
          positnCnvncFcltSrvcExpln?: string | null
          positnIntdcCn?: string | null
          positnLotnoAddr?: string | null
          positnNm?: string | null
          positnPstnAddExpln?: string | null
          positnPstnLat?: number | null
          positnPstnLot?: number | null
          positnRdnmAddr?: string | null
          positnRgnNm?: string | null
          prkMthdExpln?: string | null
          rprsTelnoCn?: string | null
          satSalsHrExplnCn?: string | null
          sunSalsHrExplnCn?: string | null
          telnoExpln?: string | null
          thurSalsHrExplnCn?: string | null
          tmprLhldyCn?: string | null
          tuesSalsHrExplnCn?: string | null
          wedSalsHrExplnCn?: string | null
        }
        Update: {
          bscTelnoCn?: string | null
          clctItemCn?: string | null
          comRelSrwrdListCn?: string | null
          dyoffBgndeCn?: string | null
          dyoffEnddtCn?: string | null
          dyoffRsnExpln?: string | null
          etcMttrCn?: string | null
          friSalsHrExplnCn?: string | null
          indivRelSrchListCn?: string | null
          indivTelnoCn?: string | null
          lhldyDyoffCn?: string | null
          lhldySalsHrExplnCn?: string | null
          lnkgHmpgUrlAddr?: string | null
          monSalsHrExplnCn?: string | null
          objID?: string | null
          point?: number | null
          positnCnvncFcltSrvcExpln?: string | null
          positnIntdcCn?: string | null
          positnLotnoAddr?: string | null
          positnNm?: string | null
          positnPstnAddExpln?: string | null
          positnPstnLat?: number | null
          positnPstnLot?: number | null
          positnRdnmAddr?: string | null
          positnRgnNm?: string | null
          prkMthdExpln?: string | null
          rprsTelnoCn?: string | null
          satSalsHrExplnCn?: string | null
          sunSalsHrExplnCn?: string | null
          telnoExpln?: string | null
          thurSalsHrExplnCn?: string | null
          tmprLhldyCn?: string | null
          tuesSalsHrExplnCn?: string | null
          wedSalsHrExplnCn?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
